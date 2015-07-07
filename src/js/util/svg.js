/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
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

define(function (require, exports) {
    "use strict";

    var _ = require("lodash"),
        layerLib = require("adapter/lib/layer");
   
    /**
     * Get the class name for the layer face icon for the given layer
     *
     * @private
     * @param {Layer} layer
     * @return {string}
    */
    var getSVGFromLayer = function (layer) {
        var iconID = "layer-";
        if (layer.isArtboard) {
            iconID += "artboard";
        } else if (layer.kind === layer.layerKinds.BACKGROUND) {
            iconID += layer.layerKinds.PIXEL;
        } else if (layer.kind === layer.layerKinds.SMARTOBJECT && layer.isLinked) {
            iconID += layer.kind + "-linked";
        } else {
            iconID += layer.kind;
        }

        return iconID;
    };

    /**
     * Get the class name as an array for the layer face icon for the given layer type
     *
     * @private
     * @param {string} layerKind
     * @return {Array.<string>}
    */
    var getSVGFromLayerType = function (layerKind) {
        var iconIDs = [],
            isLinked = _.has(layerKind, "linked");

        _.forEach(layerKind, function (kind) {
            var iconID = "layer-";

            // No svg for these
            if (kind === "solidcolor" || kind === "gradient" || kind === "pattern") {
                iconID = "tool-rectangle";
            } else if (kind === "artboard") {
                iconID += "artboard";
            } else if (kind === "background") {
                iconID += layerLib.layerKinds.PIXEL;
            } else if (kind === "smartobject" && isLinked) {
                iconID += layerLib.layerKinds.SMARTOBJECT + "-linked";
            } else if (kind !== "layer") {
                iconID += layerLib.layerKinds[kind.toUpperCase()];
            }

            if (kind !== "layer") {
                iconIDs.push(iconID);
            }
        });

        return iconIDs;
    };

    exports.getSVGFromLayer = getSVGFromLayer;
    exports.getSVGFromLayerType = getSVGFromLayerType;
});
