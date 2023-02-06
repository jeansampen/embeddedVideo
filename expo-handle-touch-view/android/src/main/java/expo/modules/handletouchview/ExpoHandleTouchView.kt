package expo.modules.handletouchview

import android.content.Context
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import expo.modules.kotlin.viewevent.EventDispatcher
import android.view.MotionEvent

class ExpoHandleTouchView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    private val onTouch by EventDispatcher()

    override fun onTouchEvent(event: MotionEvent?): Boolean {
        // return super.onTouchEvent(event)
        return true;
    }

    override fun onInterceptTouchEvent(ev: MotionEvent?): Boolean {
        ev?.let {
            val actionType: String = "${it.action}"
            onTouch(mapOf("type" to actionType))
        }
        return false
        //return super.onInterceptTouchEvent(ev)
    }
}
