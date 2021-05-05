


# Swift tips

> This is a growing list of resources and tips I compile to make my developer life easier.

-----------------------------------------

## AutoLayout

`translatesAutoResizingMasksIntoConstraints = false` is done by Interface Builder automatically. If working in code do it yourself.

Constants are essentially linear equations.

**Content compressionresistance priority** controls how the frame of a `UIView` will be calculated when AutoLayour contraints (one or more) describe its width/heigh as being smaller than its intrinsic content size.

**Content hugging** deals whether or not a view can be made larget than its intrinsic content size instead of managing wheter a view is made smaller than its intrinsic content size.

`setContentHuggingPriority`

* [**Layout guides**](https://developer.apple.com/documentation/uikit/uilayoutguide#) create invisible boxes that exist for a layout purpose. Use them to **replace dummy views** that you might have created to represent spacers between views. They can also act as a **black box** containing a number of other views and controls.

**How to deal with 'Unsatisfiable Layouts' errors?**

* Check if `translatesAutoResizingMasksIntoConstraints` is set to `false` on the views we're adding constraints to.
* Review the **priorities**, **content hugging** and **compression resistance** of each constraint.
* AutoLayout will try to get as close to the desired result as possible while still satisfying all other constraints.

Add [**identifiers**](https://developer.apple.com/documentation/uikit/nslayoutconstraint/1526879-identifier) to a constraint to see the associated Auto Layout messages.

To get a full list of the constraints responsible for positioning a view within its superview log the results of calling the `UIView` instance with `constraintsAffectingLayout(for:)`.

```swift
view.constraintsAffectingLayout(for: .vertical)
view.constraintsAffectingLayout(for: .horizontal)
```

[**AutoLayout's Visual Format Language**](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html)

**Animate constraints** using:
* [`layoutIfNeeded()`](https://developer.apple.com/documentation/uikit/uiview/1622507-layoutifneeded#) forcing the layout to be laid out before animating. It does so immediately if layout updates are pending.
* [`UIView.animateWith`](https://developer.apple.com/documentation/uikit/uiview/1622594-animate#) perform the duration.

```swift
func animateConstraints() {

  // Force layout before animating
  self.view.layoutIfNeeded()

  UIView.animateWithDuration(0.4) {
    self.updateConstraints()
    // Force layout inside the animation block
    self.view.layoutIfNeeded()
  }
}
```

## Background Operations

https://littlebitesofcocoa.com/76-background-fetch
https://www.andyibanez.com/posts/modern-background-tasks-ios13/

<details>

 <summary>Codable </summary>
Codable maps JSON into model types. Not only it can be used to work with JSON but it cna also decode a .plist file into Swift structs and vice versa.

https://www.donnywals.com/an-introduction-to-working-with-codable-in-swift/
https://www.donnywals.com/customizing-how-codable-objects-map-to-json-data/
https://www.donnywals.com/writing-custom-json-encoding-and-decoding-logic/
https://www.donnywals.com/splitting-a-json-object-into-an-enum-and-an-associated-object-with-codable/
</details>

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

https://www.jessesquires.com/blog/2021/04/05/why-swift-closures-are-not-equatable/

## CloudKit

## Combine

**What's the difference between `flatMap` and `map`?** They behave differently than `Sequence.map` and `Sequence.flatMap`. `Publisher.map(_:)` works like `Sequence.map` except it operates with publishers. Takes a closure that changes an element into another element. `Publisher.flatMap(_:)` transforms a publisher into a completely new publisher that produces elements of the same type. Use it whenever you want to reach into inner publisher to get its elements.

* A **Future** is a placeholder for a value that doesn't exist yet.

## Debugging

Adding an **exception breakpoint** to the **Breakpoint navigator** will pause the execution whenever an exception is thrown. This will let you poke around the causes that produced it.

**Conditional breakpoints** pause execution whenever a certain condition is met.

On the **debugging console** use `p` or `po` to print out variables. Use `e`to evaluate an expression or modify values.

A **property breakpoint** is a breakpoint set on the line that contains a **property definition**. Xcode will pause execution anytime that property's value is changed. It will also display a stack trace of the function that caused the change.

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

## Dynamic Type

Dynamic Type lets users specify their preferred text size. Apps that support this feature will adjust their text based on the user preferred text size.

## Instruments

## Error Handling

https://www.andyibanez.com/posts/error-protocol-specializations-swift/

## Foundation

## Methods

**Chainable methods** perform actions and return `self` so we can compose compossable code.

```swift
class ChainableTest {

  var number: Int?
  var numberStringified: String?

  func double(_ number: Int) -> Self {

    self.number = number * 2

    return self
  }

  func toString(_ textToAdd: String) -> Self {

      if let number = number {
        numberStringified = "\(textToAdd) \(number)"
      }

      return self
  }
}

let result = ChainableTest()
    .double(5)
    .toString(">")

```

### Grand Central Dispatch

Also referred to as GCD.

One common use is to hop on to a background queue to do some work and then hop onto the main queue to update the UI

dispatchonce

dispatchafter

### Lazy properties

* `lazy` is great for times when we have expensive work to perform.

## Local Notifications

**Local Notifications** a system notification without needing to implement a push server. Register the device to receive these notifictions under AppDelegate's `didFinishLaunchingWithOptions:` methos.

## Remote Notifications

[WWDC 2020 Session 10095](https://developer.apple.com/wwdc20/10095)

Push notifications do not require your app to be in the foreground. They are delivered regardless of the app state and if necessary your application will be launched.

* Alert notifications: Visible notifications that can be interacted with and display new information. Doesn't require the application to be in the foreground, can be delivered with the app in the background. The appearance can be customizable
* Background notifications: Allow your app to fetch data in the background upon receiving a background notification. System will launch the app if necessary and will give you runtime to perform your update. There are some limitations as the system limits the number of times you can update your app per day. Updates won't be performed if the app is on a constrained state such as low battery. 

**Set up remote push notifications**

1. Register for remote notifications in [`application(_:didFinishLaunchingWithOptions:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622921-application#). Will register the device for APNS and will send a token. It will identify your device and can be targeted to send specific notifications.

```swift
UIApplication.shared.registerForRemoteNotifications()
```

2. Conform to [`UNUserNotificationCenterDelegate`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate#).
3. Assign the `AppDelegate` as a delegate for the Notification Center. This will let your app be notified when an alert is received.

```swift
UNUserNotificationCenter.current().delegate = self
```

4. Once you've registered to receive remote notifications you will receive a delegate call on either these two methods: [`application(_:didFailToRegisterForRemoteNotificationsWithError:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622962-application#) or [`application(_:didRegisterForRemoteNotificationsWithDeviceToken:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622958-application#).
5. If registration suceeds you need to send the token to your server so it's able to send notifications later on. The token is delivered as a `Data` object and it needs to be converted to a String.

```swift
let tokenComponents = token.map { data in String(format: "%02.2hhx", data) }
let deviceTokenString = tokenComponents.string()
```

6. Ask for permission so your app is able to display notifications using [`requestAuthorization(options:completionHandler:)`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter/1649527-requestauthorization#).

Notifications being sent to a device have a JSON payload specifying how to render the notification.

When a notification is being opened or interacted with [`userNotificationCenter(_:didReceive:withCompletionHandler:)`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649501-usernotificationcenter#) will be called.





## Generics

Generics are a way to specifying parts of your code can work with different types of objects of a given type but you don't want to hardcode one singlet type. It would be something like *"this function accepts any object of some type and returns an object of that same type but I do not care what that type is"*.

```swift
func genericOperation<Type>(parameter: Type) -> Type {
    return parameter
}
```

The `< >` brackets inform the Swift compiler that you are writing a generic function. You can use any name you want for `Type`. Swift generics also let you only accept types that conform to a protocol.

```swift
func genericOperation<Type: SomeProtocol>(parameter: Type) -> Type {
    return parameter
}
```

Generics not only can be applied to functions but also types. For example this is a generic data source.

```swift
struct DataSource<ObjectType> {
  var objects = [ObjectType]()

  func objectAtIndex(index: Int) -> ObjectType {
    return objects[index]
  }
}
```

So that property can later be used:

```swift
class SpaceshipsViewController : UITableViewController {
  var dataSource = DataSource<Spaceship>()
}
```

## Gesture Recognizer

## Handoff

Begin a task or activity on one device and then continue it on another one.


## Multipeer Connectivity

Allows devices to communicate with each other without the need for a central server.

## Networking

[Reachability.swift](https://developer.apple.com/library/archive/samplecode/Reachability/Introduction/Intro.html) helps you deal with how "reachable" internet is at a given time.

### URLSession

Use [`URLComponents`](https://developer.apple.com/documentation/foundation/urlcomponents#) to compose URLs in a safer and more predictable way. You can also manually get all the components by instantiating `URLComponents` from a URL.

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

## NSCoding

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

## Protocols

**Protocol extensions** allow you to add new functions to any class that implements a protocol.

## SwiftUI

SwiftUI makes use of property wrappers to understand how we create and store data in our views. They wrap behavior along with properties.

All **property wrappers** conform to [`DynamicProperty`](https://developer.apple.com/documentation/swiftui/dynamicproperty) protocol.

This is a good rule of thumb to know **what property wrapper to use**.

* Displaying a value type (`struct` or `enum`)
  * Won't change over time, use a regular property
  * Used to read/write from it?
    * If you're passing the value rom outside use `Binding`.
    * To store local view state use `State`. If you're doing something with a gesture on a `View` use `GestureState`.
* Displaying a reference type (`class`)
  * Creating the object locally in your view, use `StateObject`
  * Passed as a parameter, use `ObservedObject`
  * Passed through the environment, `EnvironmentObject`.

These property wrappers are not the only ones. You also have other types for specific purposes.

* [`AppStorage`](https://developer.apple.com/documentation/swiftui/appstorage#) to read and write data using `UserDefaults`.
* [`Environment`](https://developer.apple.com/documentation/swiftui/environment#), to read value from a SwiftUI `View` environment.
* [`FetchRequest`](https://developer.apple.com/documentation/swiftui/fetchrequest#), reading from a Core Data store.
* [`Published`](https://developer.apple.com/documentation/combine/published#), automatically announces changes to properties. Constrained to use it on classes only. Subscribers receive the new value before it's actually set on the property.
* [`ScaledMetric`](https://developer.apple.com/documentation/swiftui/scaledmetric#), scales a numeric value.
* [`SceneStorage`](https://developer.apple.com/documentation/swiftui/scenestorage#), reads and writes data to the current scene.

**Save data when your app quits**, need to know when your app is going to be quit

For SwiftUI lifecycle

```swift
@main
struct MySwiftUIApp: App {
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .onChange(of: scenePhase) { phase in
            if phase == .background {
                // Save here
            } 
        } 
    }   
}
```

AppDelegate Life Cycle

```swift
func applicationDidEnterBackground(_ application: UIApplication) {
    // Save here
}
```

## UIKit

### UIKit View Lifecycle

* `viewDidLoad()` is called whenever we programatically create the interface. Performs additional initialization on views.
* `loadView()` creates the view that the controller manages. **Should only be used when you programatically instantiate your view controllers**. When using Storyboards this is the method that will load your nib and attach it to the view but when instantiating ViewControllers manually all this method does is create an empty `UIView`.

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

* Scheme enable zombie objects

https://www.swiftdevjournal.com/using-environment-variables-in-swift-apps/

### Keyboard Shortcuts

* `Command + Shift + O`: Open a file inside Xcode. This will allow you to work faster when changing files without needing to reach from your mouse.

## Resources

These are a collection of blogs, links, books, videos that helped me learn different topics. Buying the books linked below from their respective authors help them contribute to the community.

* Combine
  * Joseph Heck's [Using Combine](https://heckj.github.io/swiftui-notes/) book
  * Donny Wals' [Practical Combine](https://gumroad.com/l/practical-combine) book
  * Daniel H Steinberg's [A Combine Kickstart](https://gumroad.com/l/combineKickstart)
* Paul Hudson's [Hacking with Swift](https://www.hackingwithswift.com)
* John Sundell's [Swift by Sundell](http://swiftbysundell.com)
* Vincent Pradeilles' [YouTube channel](https://www.youtube.com/channel/UCjkoQk5fOk6lH-shlm53vlw)
* Objc.io's [App Architecture iOS Application Design Patterns in Swift](https://www.objc.io/books/app-architecture/) book