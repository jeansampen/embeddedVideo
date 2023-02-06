import ExpoModulesCore

public class ExpoHandleTouchViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoHandleTouchView")

    View(ExpoHandleTouchView.self) {
      Events("onTouch")
    }
  }
}