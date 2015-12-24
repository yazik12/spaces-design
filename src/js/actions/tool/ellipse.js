/*
 * Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
 *  
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *  
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 * 
 */

import * as Promise from "bluebird";

import { ps, lib } from "adapter";

import * as toolActions from "js/actions/tools";
import * as locks from "js/locks";

var UI = ps.ui,
    descriptor = ps.descriptor,
    toolLib = lib.tool,
    vectorMaskLib = lib.vectorMask;

/**
 * Sets the tool into either path or shape mode and calls the approprate PS actions based on that mode
 *
 * @private
 */
export var select = function () {
    var toolStore = this.flux.store("tool"),
        vectorMode = toolStore.getVectorMode(),
        toolMode = toolLib.toolModes.SHAPE,
        firstLaunch = true;

    if (vectorMode) {
        toolMode = toolLib.toolModes.PATH;
    }

    var setObj = toolLib.setShapeToolMode(toolMode);

    var setPromise = descriptor.playObject(setObj);

    if (!vectorMode && firstLaunch) {
        var defaultPromise = this.transfer(toolActions.installShapeDefaults,
            "ellipseTool");

        firstLaunch = false;
        return Promise.join(defaultPromise, setPromise);
    } else if (!vectorMode) {
        return setPromise;
    } else {
        return setPromise
            .then(function () {
                return UI.setSuppressTargetPaths(false);
            })
            .then(function () {
                return descriptor.playObject(vectorMaskLib.activateVectorMaskEditing());
            });
    }
};
select.action = {
    reads: [locks.JS_TOOL],
    writes: [locks.PS_TOOL, locks.PS_APP],
    transfers: ["tools.installShapeDefaults"],
    modal: true
};
