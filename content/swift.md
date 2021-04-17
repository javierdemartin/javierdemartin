# Swift tips

> This is a growing list of resources and tips I compile to make my developer life easier.

-----------------------------------------

## AutoLayout

`translatesAutoResizingMasksIntoConstraints = false` is done by Interface Builder automatically. If working in code do it yourself.

Constants are essentially linear equations.

### Compression Resistance & Content Hugging

**Content compressionresistance priority** controls how the frame of a `UIView` will be calculated when AutoLayour contraints (one or more) describe its width/heigh as being smaller than its intrinsic content size.

**Content hugging** deals whether or not a view can be made larget than its intrinsic content size instead of managing wheter a view is made smaller than its intrinsic content size.

`setContentHuggingPriority`

## Background

https://littlebitesofcocoa.com/76-background-fetch

## Codable & Decodable

Decodable maps JSON into model types.



### Downloads

https://littlebitesofcocoa.com/77-background-downloads

### Fetching

## Closures

**Strong capturing** is used as default by Swift. The closure will capture any external values that are used inside the closure and make sure they are neved destroyed.

**Weak capturing**. Weakly captured values aren't kept alive by the closure, so they might be destroyed and set to `nil`. Weakly captured values are always optional in Swift. This stops you assuming they are present when in fact they might not be.

**Unowned capturing** behaves more like implicitly unwrapped optionals. Like weak capturing, unowned capturing allows values to become `nil` at any point in the future. For example, `[unowned self]` means you want to reference `self` inside the closure but you don't want to own it. If `self` is `nil` inside a closure there's something else you should be looking for.

Closures themselves are copied because their captured data becomes shared amongst copies.

**When to use each one?** If you don't have any idea, start with `weak` and change accordingly only if you need to.

--------

**Strong reference cycles**

<!-- **Copies of closures** -->

**Accidental strong references**

## CloudKit

## Combine

**What's the difference between `flatMap` and `map`?** They behave differently than `Sequence.map` and `Sequence.flatMap`. `Publisher.map(_:)` works like `Sequence.map` except it operates with publishers. Takes a closure that changes an element into another element. `Publisher.flatMap(_:)` transforms a publisher into a completely new publisher that produces elements of the same type. Use it whenever you want to reach into inner publisher to get its elements.

* A **Future** is a placeholder for a value that doesn't exist yet.

## Dependency Injection

Create some type or object while passing in some other type or object that the first type depends on to do its work.

It's useful around testing so you can pass a mock version that can behave in expected ways. Also, by not using shared instances and passing specific types we reduce the global/shared state in the codebase.

## Design Patterns

* **Singletons** are a design pattern describing globally accessible instances of objects. They should only be used when there is a shared global state that needs to be read/written. They are thread-safe and lazily initialized. Classes like `URLSession`, `FileManager` and `UserDefaults` use this design pattern.

```swift
class MySingleton {

    /// The initializer of global variables and static properties are executed lazily by default.
    static let shared = MySingleton()

    /// Private initializer, only `MySingleton` can create instances of itself
    private init() { }
}

```

## Instruments

## Foundation

### Grand Central Dispatch

Also referred to as GCD.

One common use is to hop on to a background queue to do some work and then hop onto the main queue to update the UI

dispatchonce

dispatchafter

### Lazy properties

* `lazy` is great for times when we have expensive work to perform.

## Multipeer Connectivity

Allows devices to communicate with each other without the need for a central server.

## Networking

[Reachability.swift](https://developer.apple.com/library/archive/samplecode/Reachability/Introduction/Intro.html) helps you deal with how "reachable" internet is at a given time.

### URLSession

### Network.framework

### Low Data mode

It's an explicit **user preference** to minimize data usage. Background app refresh is disabled and discretionary tasks should be deferred. Your application should implement specific policies that react to these changes.

How can you implement this?

* If your app is image-heavy reduce the quality of the images.
* Reduce pre-fetching. Avoid fetching resources taht users won't need
* Synchronize less often
* Mark background tasks as discretionary, some of them might not need to be executed immediately.


```swift
allowsConstrainedNetworkAccess = false
```

### Time Profiler

A common use is to detect under-performing functions that might be blocking the main thread.

Turn all the **call tree** options. This will clean up the collected data

## Optionals

Multiple/Chained optional unwrapping. You can even use unwrapped references from earlier in the statements in later parts of the statement.

```swift
if let URL = NSURL(string: someURL),
   let data = NSData(contentsOfURL: URL),
   let ship = Spaceship(data: data) {
    // use 'ship'
}
```

## Pointers

A **pointer** is a variable that stores the memory address of an object. Swift's pointers can be broken into the following types:

* A **buffer**

* A **mutable** type allows us to mutate the memory referenced by that pointer. An **immutable** type provides read-only access to the referenced memory.

* A **raw** type contains uninitialized and untyped data. Raw pointers must be bound to a certain type and value before we can use them. They can be reinterpreted to several different types. **Typed** pointers have a generic parameters, which is the type of the value being pointed to. Useful when we don't know what kind of data we point to.

* An **unsafe** type does not have some of Swift's safety features. It's possible to violate memory, access unallocated memory or interpret memory as wrong type by means of unsafe pointes.

* A **managed** type has automatic memory management. An **unmanaged** type makes you partially responsible for the object's lifecycle.

|          C Variables         |       Swift Pointers      |
|:----------------------------:|:-------------------------:|
| const int * someInt          | UnsafePointer<Int>        |
| int * anotherInt             | UnsafeMutablePointer<Int> |
| struct Spaceship * spaceship | COpaquePointer            |

**How about `void` pointers in C?** 

```C
void someFunction(const void *someVariable);
```

```swift
/// Create a regular `Int` value in Swift
var myVariable = 31
/// Pass the `Int` into the `withUnsafePointer` function along with a closure.
/// We will receive an `UnsafePointer` of our original `Int`.
withUnsafePointer(&myVariable) { (p: UnsafePointer<Int>) in
	/// Convert the pointer to a void pointer using `unsafeBitCast`
	let voidP = unsafeBitCast(p, UnsafePointer<Void>.self)
	someFunction(voidP)
}
```

----------------------

### Calling functions with pointer parameters

Apple has a [nice guide](https://developer.apple.com/documentation/swift/swift_standard_library/manual_memory_management/calling_functions_with_pointer_parameters) on this.

## UI Testing

Pass parameters into a UI Test so the device knows it's running a UI test.

```swift
let app = XCUIApplication()
app.launchArguments = [ "IS_UI_TESTING" ]
app.launch()
```

## Universal Links

They tie the content in your app to the content on a website. Once it's configured iOS will be able to launch your app when a user taps alink somewhere, rather than opening our site in Safari.

## Widgets

Debugging certain sizes of a widget

- From the widget's Xcode scheme add an environment variable for `_XCWidgetFamily`.
- Set the value to `small`, `medium` or `large` and the widget will boot to that size.

## Xcode

Scheme enable zombie objects

### Keyboard Shortcuts

* `Command + Shift + O`: Open a file inside Xcode. This will allow you to work faster when changing files without needing to reach from your mouse.