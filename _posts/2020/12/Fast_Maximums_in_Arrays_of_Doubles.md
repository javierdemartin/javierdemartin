---
title: Fast Maximums in Arrays of Doubles
author: Javier de Martín
date: 2020-12-31
published: true
---

As of lately I have been dealing with underperformance when doing operations on abnormally huge arrays of Doubles.

The issue in question is obtaining the maximum of value of the array in question, this wouldn't be a noticeable issue with normal sized arrays but when they grow up in size it's a huge time saver.

In a normal situation you'd obtain the maximum value of an array using the `.max()` function.

```swift
let samples = Array(repeating: Double.random(in: 0..<100), count: 100000000)

guard let maximum = samples.max() else { return }
```

Alternatively, a faster option is to use the [Accelerate](https://developer.apple.com/documentation/accelerate#) framework is one of those. It's used to make large-scale mathematical operations optimized for performance.

```swift
import Accelerate

public extension Array where Element == Double {
    func fastMax() -> Element {
        var elem = 0.0
        var vdspIndex: vDSP_Length = 0
        vDSP_maxviD(self, 1, &elem, &vdspIndex, vDSP_Length(self.count))
        
        return self[Int(vdspIndex)]
    }
}
```

Creating a quick XCTest case you can see the tenfold increase in performance this can be.

```swift
import XCTest
@testable import Singlet

class SingletTests: XCTestCase {
    
    let samples = Array(repeating: Double.random(in: 0..<100), count: 100000000)

	/// Average of 9.77s
    func testExample() throws {
        self.measure {
            samples.max()!
        }
    }
    
	/// Average of 0.14s    
    func testFasterExample() throws {
        self.measure {
            samples.fastMax()
        }
    }
}
```

The Accelerate framework also provides a method to deal with minimum values, [vDSP_minviD(\_:\_:\_:\_:\_:)](https://developer.apple.com/documentation/accelerate/1450441-vdsp_minvid#).