package expo.modules.handletouchview


import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoHandleTouchViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoHandleTouchView")

    View(ExpoHandleTouchView::class) {
      Events("onTouch")
    }
  }
}