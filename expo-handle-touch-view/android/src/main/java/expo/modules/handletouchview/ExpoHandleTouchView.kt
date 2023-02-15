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
            val x = it.x;
            val y = it.y;
            val rawX = it.rawX;
            val rawY = it.rawY;
            onTouch(mapOf("type" to actionType, "x" to x, "y" to y, "rawX" to rawX, "rawY" to rawY));
        }
        return false
        //return super.onInterceptTouchEvent(ev)
    }
}
