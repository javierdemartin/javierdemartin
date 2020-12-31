---
title: Unsafe C & safe Swift
author: Javier de Martín
date: 2020-10-25
published: true
---

Hey, this is a work in progress!

## Why?

Safe code ensures predictable behavior. That can be either working without a problem or crashing. Either way you know what is happening. But this is not always the case as you're going to see. Surprisingly, there's one thing worse than not crashing, having [undefined behavior](https://blog.llvm.org/posts/2011-05-13-what-every-c-programmer-should-know/).

Swift brought the [Optional](https://developer.apple.com/documentation/swift/optional#) type to enforce knowing whether a variable is null or not. You can actually force a crash unwrapping a variable that's null. And in some cases it might be better to crash than accessing an invalid memory address.

```
let value: Int? = nil
print(value!) // Fatal error: Unexpectedly found nil while unwrapping an Optional value
```

This is an unsafe operation, but its behavior is well defined for all inputs.

On the other side, Swift also allows fairly easy interaction with C, an unsafe language by nature. **This doesn't mean writing safe C code is safe Swift code** as both languages have a very different memory layout. For example, in C every variable has an address whereas in Swift a variable doesn't necessarily have addresses except inside a scope that creates an address explicitly.

------------------------

Not using pointers at all is a great strategy for code safety but you might need to interact with either Objective-C or C APIs that require the use of pointers. These kind of interactions can be done through **unsafe** interfaces that provide memory access.

```
Unsafe [Mutable] [Raw] [Buffer] Pointer [<T>]
```

1. `Unsafe`, only reads values of that type from memory
2. `Mutable`, reads or writes values of that type
3. `Raw`, points to a blob of bytes
4. `Buffer`, works like a collection
5. Generic `<T>`, pointers are typed

The `Unsafe` family of APIs provide direct memory access. You're accessing memory that the compiler isn't checking and if done incorrectly can lead to [undefined behavior](https://blog.llvm.org/posts/2011-05-13-what-every-c-programmer-should-know/) which can be worse than a predictable crash. This unsafe interaction is always denoted by the prefix *Unsafe*, that way you are aware of the possible outcomes of dealing with this kind of access.

## Pointer Safety

In C, before pointing to an object you need a **stable** memory location. That stable storage has a **limited lifetime** either because it goes out of scope or because it's explicitly deallocated from memory. The pointer value has its own lifetime. 

If the pointer's lifetime exceeds the storage's lifetime any attempt to access it will result in undefined behavior. This is the main cause of unsafe behavior with pointers.

To access a type in memory you have to know what kind of type you need to read or write from. Pointers have their own types distinct from the types of values in memory. How to ensure those types are consistent and what happens if they aren't?

If you ask for a pointer to storage of type `Int16` you will get back a pointer to `Int16`. But you can write the same memory space with a different type than the former. If that's the case you will receive a new pointer to the newly created type but the original pointer can still be hanging around and accessing the old pointer is undefined behavior because the pointer type and the in-memory type are now inconsistent.

**How can undefined behavior be worse than a program crash and why typed pointers cause that?**  Swift pointers safely interoperate with C though you need to be as least as strict as C to safely interoperate.

## UnsafePointer aka Typed Pointers

[`UnsafePointer<T>`](https://developer.apple.com/documentation/swift/unsafepointer#) let's you take responsibility for some of the dangers of using pointers without worrying about type safety, that's why they are also called typed pointers. genre **Type parameter is enforced at compile time making it a type safe API**. Typed pointers give you direct access to memory but only within the confines of type safety you can't have two typed pointers to the same memory that disagree on the type.

You don't always need to initialize typed pointers directly. They can be derived from raw pointers as well.

* Unsafe Pointers: Pointers to objects which Swift can represent (such as primitives or structs) will be represented in Swift by a set of generics, UnsafePointer<> and UnsafeMutablePointer<>. Finally, all four of these types have an associated “raw” version which is not generic and is equivalent to C’s void*s: UnsafeRawPointer, etc.

| Swift Pointer Type                     | Equivalent C Type |
|-------------------------------|-------------------|
| UnsafePointer<T>                     | const T * Pointer       |
| UnsafeBufferPointer                 |                   |
| UnsafeMutablePointer<T>        | T * Pointer             |
| UnsafeMutableBufferPointer    |                   |
| UnsafeRawPointer              | const void*       |
| UnsafeRawBufferPointer        |                   |
| UnsafeRawMutablePointer       | void*             |
| UnsafeRawMutableBufferPointer |                   |
 
These types will allow you to work with memory allocated in C or C++ and passed to Swift, but no automatic memory management or garbage collection will be performed on the memory they point to. They are essential for passing data from native code to Swift but you should be careful to make sure that any objects are deallocated after you are done with them.

------------------

**UnsafePointer's type parameter indicates the type of value expected to be held in memory**. Also known as a **typed pointer**, `UnsafePointer<T>`, as the memory location you're pointing to can only hold values of that type. Memory locations are bound to a type and typed pointers only read or write values of the memory's bound type.

In C it's not uncommon to cast pointers to different types with both pointer continuing to refer to the same memory. Whether that's legal in C depends on various special cases. Bu in Swift, **accessing a pointer whose type parameter deos not match its memory location's bound type  is always undefined behavior**. To guard against this, **Swift does not allow casting pointers in the familiar C style**. By doing this, pointer types are enforced at compile time by Swift's type system.

```swift
var i: Int = 5
let a = withUnsafePointer(to: i) { ptr -> UnsafePointer<Int> in
    
    print(ptr.pointee) /// "5"
    i = ptr.pointee * 2 /// 10
    print(i) /// "10"
    /// Okay, never ever do this
    return ptr
}

/// Gibberish value that should not be used, "140732855006848"
print(a.pointee)

print(i) // 10
```

`withUnsafePointer(to:)` provides access to the pointer inside a closure. This pointer should only be used inside the scope of the closure as returning it will not guarantee stable behavior.

https://developer.apple.com/documentation/swift/unsafemutablepointer/1641233-pointee#

When dealing with Arrays, storage is bound to the array's element type. Asking for a pointer into array storage gives you a pointer to the array's element type, `UnsafeBufferPointer<Element>`.

You can allocate memory directly by calling

```
let COUNT = 1
let t = 10

// Allocation binds memory to its type parameter and returns a typed pointer to the new memory but it doesn't hold any initialized values yet
let tPtr = UnsafeMutablePointer<Int>.allocate(capacity: COUNT)
// Initialize memory only to the correct type
tPtr.initialize(repeating: t, count: COUNT)

print(tPtr)
print(tPtr.move())
print(tPtr.move())
print(tPtr.pointee)

// Memory can be reasigned, assignment implicitly deinitializes the previous in-memory value and reinitializes memory to a new value of the same type.
tPtr.assign(repeating: t, count: COUNT)
// Deinitialize memory using the same typed pointer
tPtr.deinitialize(count: COUNT)
tPtr.deallocate()

print(tPtr.pointee)
```

You generally won't have two active pointers to the same memory location that disagree on the type as typed pointers follow simple strict rules.

What happens with composite types? Using a `struct` you can either get a pointer to the outer struct or a pointer to its property and both are valid at the same time. We can access either one without changing the type that memory is bound to. This obeys same basic rule for pointer safety. When memory is bound to a composite type it's also effectively bound to the members of that type as they're laid out in memory.

------------------

## UnsafeRawPointer

[UnsafeRawPointer](https://developer.apple.com/documentation/swift/unsaferawpointer#) interprets bytes as typed values and with this you don't get any safety guarantees like type safety neither alignment guarantees. The memory referenced by this type can be in one of several states:

1. Raw, uninitialized memory. Raw memory that has just been allocated in an untyped state. It must be initialized with values of a type before it can be used with any typed operations. 
2. Typed Memory has already been bound to a type whether it is initialized or uninitialized.

Memory that has been bound to a type can be rebound to a different type only after it has been reinitialized or if the bound type is a *trivial type*.

**It's always possible to cast a Raw pointer down from a typed pointer to a raw pointer but not backwards**. Casting a raw pointer into a typed pointer is not possible as it would conflict with the memory's bound type.

You can ask that `UnsafeRawPointer` to load any type as it reads the required number of bytes requested by that type and assembling them into the requested type using [`load(fromByteOffset:as:)`](https://developer.apple.com/documentation/swift/unsaferawpointer/2428607-load).

`UnsafeRawPointers` can also be used to write a value's bytes into memory. **Storing bytes is an asymmetric operation with loading** as it modifies the in-memory value. Unlike assignment, using typed pointers does not reinitialize the previous value in memory so it's your task to make sure the memory does not contain any object references. TRY `stroreBytes(of: u, as UInt32.self)`. When the bytes are written to memory they're reinterpreted as the memory's bound type so the typed pointer that already points to the in-memory value can still be used to access it.

When the bytes are written to memory they're reinterpreted as the memory's bound type so the typed pointer that already points to the in-memory value can still be used to access it.

The deepest level Swift provides a few APIs for binding memory to types. By using this you take full responsibility away from swift for managing the safety of pointer types.

**Casting from a typed pointer is not only the only way to get a raw pointer**. The `withUnsafeBytes` API exposes a variable storage as a raw buffer for the duration of its closure. This is a collection of bytes just like `UnsafeBufferPointer` is a collection of typed values. You can also modify a variable's raw storage with `withunsafebytes` as it gives you a collection of mutable bytes.

Array exposes withunsafebuffer pointer also has unsafe bytes that exposes raw storage for the array elements. The buffer size owl be array's count multiplied by the element stride `MemoryLayout<Element>.stride`.

Allocate raw memory using allocate

```swift
// You take responsibility to compute the memory size and alignment in bytes. After this raw allocation memory state is neither initialized nor bound to a type
Let rawest = Unsafemutablerawpointer.allocate(
	bytecount: memorylayout<t>.stride * numValues,
	alignment: memorylayout<t>.alignment)
// Initialize memory with a raw pointer specifying the type of values that memory with hold. Initialization bind memory to that type and returns a typed pointer.
Let tPtr = rawptr.initializememory(as: T.self, repeating: t, count: numValues)
// Must use the typed pointer tPtr to deinitialize
```

The transition to initialized memory only goes in one direction. Memory reinitialization requires you to know the type of in-memory values so there's no way to deinitialize a raw pointer. You can reinitialize using the typed pointer returned during initialization. You can only deinitialize a raw pointer as long as it's in an uninitialized state, aka not having called initialize memory. Deallocation doesn't care if memory is bound to a type or not.

Memory allocation with typed pointers is safer and more convenient so that should be preferred.

Why would you need to allocate raw storage instead? Store unrelated types in the same contiguous block of memory with variable length. 

The more likely case where you'll want to use a raw pointer is when you have a. Buffer of bytes that's externally generated. Aka una cabecera con un tipo y luego otros prueba esto.


## Mutable types

Memory-binding APIs. Bound type state, you're taking all the responsibility for pointer type safety. Maybe just check if you can use one of the above before diving down with this.

## OpaquePointers



-----------------


### APIs that expose memory's bound type

API names refer to the memory's bound type:

* assumingmemorybound, only call this when you can guarantee the memory will already be bound to the type you want. It's not checked at runtime but it's just a way to ask the compiler to make an assumption so you're on the hook whether that assumption is correct or not.
* bindmemory
* withmemoryrebound

The danger of circumventing type safety is that you can easily introduce undefined behavior somewhere else in the code where typed pointers are used. There's only one rule: access to a typed pointer needs to agree with the memory's bound type. Why would you need this? In the rare occasions where code may not preserve a typed pointer. What if we just have the raw pointer but we know with certainty what type the memory is bound to? The should be able to tell swiftt we know what we're doing and get back our typed pointer.

Another case of assumingmemoryboundto is with `pthread_create`


```
/// initialize a context pointer with our custom threadcontext type
Let contectPts = unsafeMutablePonter....

/// when calling pthread_create we pass out context pointer
```

`void *` gets imported as aunsafemutablerawpointer. There's no way to make this generally type safe.

In those examples the original pointer type was erased.

Memory can only be bound to one type at a time but since the tuple type is a composite type binding memory to a tuple type also binds it to the element types. So using a pointer to integers for the tuple's storage is type-safe. Tuples of different types have no layout guarantee.

With struct a property's memory is always bound to the property's declared type so it's safe to call assumingmemoryboundto. The layout of structs is not guaranteed so when you get a pointer to a struct property you can only use it to point a single value for that property. Pointing to struct properties is common so there's an option that avoids unsafe APIs. When you pass the property as an inout argument the compiler implicitly converts it to the unsafe pointer type declared for the function argument.

The bind memory api actually lets you change memory's bound type. If the memory location was not already bound to a type it just binds the type for the first time. If it's bound to a type the memory is rebinded and whatever values were in memory take on the new type. (See 21:50 in the corresponding WWDC Session).

**Changing the bound type of a memory region doesn't physically modify the memory** but you should think of it as changing a global property of the memory state. This isn't type safe as it reinterprets the raw bytes in place and also invalidates existing typed pointers (the pointer address is still valid but accessing them is undefined while memory is bound to the wrong type).

## Tidbits

* A Swift `String` can e used as a `const char *` pointer which will pass the function a pointer to a null-terminated UTF-8 encoded representation of the string.
* Swift arrays can be passed o functions expecting pointer arguments of the equivalent type.
* Swift functions and closures can be passed to C API functions expecting function pointer arguments

# Things

* Opaque Pointers: Pointers to types which are declared in your C headers but not defined will be translated by Swift into its OpaquePointer class. Without the definitions present there is not much you can do to them in Swift other than store them and pass them back to the API.

### Passing Memory Managed Objects to C

https://www.accusoft.com/resources/blog/accessing-cross-platform-native-apis-from-swift/

When passing objects which are dynamically allocated you run the real risk of passing already deallocated objects when they are used. For this cases the [Unmanaged](https://developer.apple.com/documentation/swift/unmanaged#) class provides two static functions for creating instances from Swift objects:

* [Unmanaged.passRetained()](https://developer.apple.com/documentation/swift/unmanaged/1541288-passretained). Used if the C API will need to hold too the reference for later use. You **need** to manually release the object.
* [Unmanaged.passUnretained()](https://developer.apple.com/documentation/swift/unmanaged)

These two differ in how the memory manager deals with the object you are creating the pointer from.

Once the `Unmanaged` instance is created you can use `toOpaque()` method to yield an `UnsafeMutableRawPointer` which can be passed to a C function.

## Other interesting links

I might not have covered everything and there might be some issues but here are some links I've found to be interesting and have taught me things:

* [Use it or lose it: why safe C is sometimes unsafe Swift](https://www.cocoawithlove.com/blog/2016/02/16/use_it_or_lose_it_why_safe_c_is_sometimes_unsafe_swift.html) by Matt Gallagher in Cocoa with Love.
* Some reminders on [undefined behavior in C](https://blog.llvm.org/posts/2011-05-13-what-every-c-programmer-should-know/) on the LLVM's blog written b Chris Lattner.
* As always, Ray Wenderlich with some of the best stuff around. A [tutorial](https://www.raywenderlich.com/7181017-unsafe-swift-using-pointers-and-interacting-with-c) on using C Pointers in Swift.
* WWDC Sessions are also documentation: [Session 10167](https://developer.apple.com/videos/play/wwdc2020/10167) on Safely managing pointers in Swift, [Session 10648](https://developer.apple.com/videos/play/wwdc2020/10648/) on Unsafe Swift are self explanatory.
* The Apple's Developer blog has a [Manual Memory Management](https://developer.apple.com/documentation/swift/swift_standard_library/manual_memory_management) page on this same topic.
* [OpaquePointer vs UnsafePointer](https://www.objc.io/blog/2018/01/30/opaque-vs-unsafe-pointers/)
* [Interacting with C Pointers](https://developer.apple.com/swift/blog/?id=6) from Apple Developer's blog