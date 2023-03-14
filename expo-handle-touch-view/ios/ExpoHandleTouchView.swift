import ExpoModulesCore
import Foundation
import UIKit

// This view will be used as a native component. Make sure to inherit from `ExpoView`
// to apply the proper styling (e.g. border radius and shadows).
class ExpoHandleTouchView: ExpoView {
  let onTouch = EventDispatcher()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    isMultipleTouchEnabled = true
  }

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
     super.touchesBegan(touches, with: event)
        let touch = touches.first;
        let point = touch?.location(in: self)
        if(point != nil){
            let x = point!.x;
            let y = point!.y;
            onTouch([
              "type": "0",
              "x": x,
              "y": y,
            ]);
        }
        else {
          onTouch([
              "type": "333",
              "x": 0,
              "y": 0,
            ]);
        }

    }
  
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
      super.touchesMoved(touches, with: event)
        let touch = touches.first;
        let point = touch?.location(in: self)
        if(point != nil){
            let x = point!.x;
            let y = point!.y;
            onTouch([
              "type": "2",
              "x": x,
              "y": y,
            ]);
        }
        else {
          onTouch([
              "type": "333",
              "x": 0,
              "y": 0,
            ]);
        }
        
    }
  
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
       super.touchesEnded(touches, with: event)
        let touch = touches.first;
        let point = touch?.location(in: self)
        if(point != nil){
            let x = point!.x;
            let y = point!.y;
            onTouch([
              "type": "1",
              "x": x,
              "y": y,
            ]);
        }
        else {
          onTouch([
              "type": "333",
              "x": 0,
              "y": 0,
            ]);
        }
       
    }
  
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
      super.touchesCancelled(touches, with: event)
        let touch = touches.first;
        let point = touch?.location(in: self)
        if(point != nil){
            let x = point!.x;
            let y = point!.y;
            onTouch([
              "type": "1",
              "x": x,
              "y": y,
            ]);
        }
        else {
          onTouch([
              "type": "333",
              "x": 0,
              "y": 0,
            ]);
        }
        
    }
}
