---
title: Mulitple architecture binaries in iOS
author: Javier de Martín
date: 2020-12-28
published: true
---

Here are some things I frequently forget and find useful when working with fat binaties, XCFrameworks and multiple architectures. Here are some little bits of information that are useful. Xcode provides useful commands like `nm`, `otool` and `lipo`.

## Bits of useful information

**Getting the available architectures present in a framework?**

```bash
> lipo -info Sample.framework/sample
Architectures in the fat file: openssl are: i386 x86_64 armv7 arm64
```

**Check if the compiled binary was built using bitcode?** Do it individually for each of the previous architecture found in the previous command. In this case, only armv7 and arm64 were compiled using bitcode.

```bash
> otool -arch i386 -l Sample.framework/sample | grep __LLVM
> otool -arch x86_64 -l Sample.framework/sample | grep __LLVM
> otool -arch armv7 -l Sample.framework/sample | grep __LLVM
    segname __LLVM
    segname __LLVM
> otool -arch arm64 -l Sample.framework/sample | grep __LLVM
    segname __LLVM
    segname __LLVM
```

**Extracting architectures from a fat binary** creating a single architecture file.

```bash
lipo -extract armv7 Sample.framework/sample -output sample-armv7
lipo -extract arm64 Sample.framework/sample -output sample-arm64
```

**Create a multi-architecture binary by joining single-architecture binaries**

```bash
> lipo sample-arm64 sample-armv7 -create -output sample-combined
> lipo -info sample-combined
Architectures in the fat file: sample-combined are: armv7 arm64
```

**Create XCFramework from a Xcode project**. It's possible to export both architectures, simulator and device, by archiving the project. 

```bash
xcodebuild archive \
    -scheme Sample \
    -archivePath $HOME/Sample-iphoneos.xcarchive \
    -sdk iphoneos \
    BUILD_LIBRARIES_FOR_DISTRIBUTION=YES \
    SKIP_INSTALL=NO \
    ENABLE_BITCODE=NO

xcodebuild archive \
    -scheme Sample \
    -archivePath $HOME/Sample-iphonesimulator.xcarchive \
    -sdk iphonesimulator \
    -destination="generic/platform=iOS"
    BUILD_LIBRARIES_FOR_DISTRIBUTION=YES \
    SKIP_INSTALL=NO \
    ENABLE_BITCODE=NO
```

Join both architectures present in each of the archived binaries to create the XCFramework that contains both of them.

```bash
xcodebuild -create-xcframework \
    -framework $HOME/Sample-iphoneos.xcarchive/Products/Library/Frameworks/Sample.framework \
    -framework $HOME/Sample-iphonesimulator.xcarchive/Products/Library/Frameworks/Sample.framework \
    -output $HOME/Sample.xcframework
```

**Does this binary contain a specific class?**

```bash
> nm Sample.framework/Sample | grep '_OBJC_CLASS_$_SAMPLE_CLASS'
```
