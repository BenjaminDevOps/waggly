// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorRateApp",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "CapacitorRateApp", targets: ["CapacitorRateApp"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.3.1"),
    ],
    targets: [
        .target(
            name: "CapacitorRateApp",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
            ],
            path: "Sources/CapacitorRateApp"
        ),
    ]
)
