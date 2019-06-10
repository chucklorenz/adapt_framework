define([
    'core/js/adapt'
], function(Adapt) {

    /**
     * Tabindex and aria-hidden manager for popups.
     * @class
     */
    var Popup = Backbone.Controller.extend({

        /**
         * List of elements which form the base at which elements are generally tabbale
         * and aria-hidden="false".
         *
         * @type {Array<Object>}
         */
        _floorStack: [$("body")],
        /**
         * List of elements to return the focus to once leaving each stack.
         *
         * @type {Array<Object>}
         */
        _focusStack: [],
        /**
         * Hash of tabindex states for each tabbable elemen in the popup stack.
         *
         * @type {Object}
         */
        _tabIndexes: {},
        /**
         * Hash of aria-hidden states for each tabbable element in the popup stack.
         *
         * @type {Object}
         */
        _ariaHiddens: {},
        /**
         * Incremented unique ids for elements belonging to a popup stack with saved
         * states,
         */
        _elementUIDIndex: 0,

        initialize: function() {
            this.listenTo(Adapt, {
                'popup:opened': function($element) {
                    Adapt.a11y.log.deprecated("Adapt.trigger('popup:opened', $element) is replaced with Adapt.a11y.popupOpened($element);");
                    this.opened($element);
                },
                'popup:closed': function($target) {
                    Adapt.a11y.log.deprecated("Adapt.trigger('popup:closed', $target) is replaced with Adapt.a11y.popupClosed($target);");
                    this.closed($target);
                }
            });
        },

        /**
         * Reorganise the tabindex and aria-hidden attributes in the document to
         * restrict user interaction to the element specified.
         *
         * @param {Object} [$popupElement] Element encapulating the popup.
         */
        opened: function($popupElement) {
            // Capture currently active element or element specified
            $popupElement = $popupElement || $(document.activeElement);
            this._addPopupLayer($popupElement);
            return this;
        },

        /**
         * Restrict tabbing and screen reader access to selected element only.
         *
         * @param {Object} $popupElement Element encapulating the popup.
         */
        _addPopupLayer: function($popupElement) {
            $popupElement = $($popupElement);
            var config = Adapt.a11y.config;
            if (!config._isEnabled) return $popupElement;
            if (!config._isPopupManagementEnabled) return $popupElement;
            if ($popupElement.length === 0) return $popupElement;
            this._floorStack.push($popupElement);
            this._focusStack.push($(document.activeElement));
            var $elements = $(config._tabbableElements).filter(config._tabbableElementsExcludes);
            var $branch = $popupElement.add($popupElement.parents());
            var $siblings = $branch.siblings().filter(config._tabbableElementsExcludes);
            $elements = $elements.add($siblings);
            $elements.each(function(index, item) {
                var $item = $(item);
                var elementUID;
                if (item.a11y_uid == undefined) {
                    item.a11y_uid = "UID" + ++this._elementUIDIndex;
                }
                elementUID = item.a11y_uid;
                if (this._tabIndexes[elementUID] === undefined) this._tabIndexes[elementUID] = [];
                if (this._ariaHiddens[elementUID] === undefined) this._ariaHiddens[elementUID] = [];
                var tabindex = $item.attr('tabindex');
                var ariaHidden = $item.attr('aria-hidden');
                this._tabIndexes[elementUID].push( tabindex === undefined ? "" : tabindex );
                this._ariaHiddens[elementUID].push( ariaHidden === undefined ? "" : ariaHidden);
                if (config._isPopupTabIndexManagementEnabled) {
                    $item.attr('tabindex', -1);
                }
                if (config._isPopupAriaHiddenManagementEnabled) {
                    $item.attr('aria-hidden', true);
                }
            }.bind(this));
            var $items = $popupElement.find(config._tabbableElements).filter(config._tabbableElementsExcludes);
            if (config._isPopupTabIndexManagementEnabled) {
                $items.attr('tabindex', 0);
            }
            if (config._isPopupAriaHiddenManagementEnabled) {
                $items
                    .removeAttr('aria-hidden')
                    .removeClass("aria-hidden")
                    .parents(config._ariaHiddenExcludes)
                    .removeAttr('aria-hidden')
                    .removeClass("aria-hidden");
            }
        },

        /**
         * Close the last popup on the stack, restoring tabindex and aria-hidden
         * attributes.
         *
         * @param {Object} [$focusElement] Element at which to move focus.
         */
        closed: function($focusElement) {
            var $previousFocusElement = this._removeLastPopupLayer();
            $focusElement = $focusElement || $previousFocusElement;
            if (!$focusElement) {
                // Focus on the first readable element
                Adapt.a11y.focusFirst('body');
                return this;
            }
            Adapt.a11y.focusFirst($($focusElement));
            return this;
        },

        /**
         * Restores tabbing and screen reader access to the state before the last
         * `_addPopupLayer` call.
         *
         * @returns {Object} Returns previously active element.
         */
        _removeLastPopupLayer: function() {
            var config = Adapt.a11y.config;
            if (!config._isEnabled) return $(document.activeElement);
            if (!config._isPopupManagementEnabled) return $(document.activeElement);
            // the body layer is the first element and must always exist
            if (this._floorStack.length <= 1) return;
            this._floorStack.pop();
            $(config._tabbableElements).filter(config._tabbableElementsExcludes).each(function(index, item) {
                var $item = $(item);
                var previousTabIndex = "";
                var previousAriaHidden = "";
                var elementUID;
                if (item.a11y_uid == undefined) {
                    //assign element a unique id
                    item.a11y_uid = "UID" + ++this._elementUIDIndex;
                }
                elementUID = item.a11y_uid;
                if (this._tabIndexes[elementUID] !== undefined && this._tabIndexes[elementUID].length !== 0) {
                    //get previous tabindex if saved
                    previousTabIndex = this._tabIndexes[elementUID].pop();
                    previousAriaHidden = this._ariaHiddens[elementUID].pop();
                }
                if (this._tabIndexes[elementUID] !== undefined && this._tabIndexes[elementUID].length === 0) {
                    //delete element tabindex store if empty
                    delete this._tabIndexes[elementUID];
                    delete this._ariaHiddens[elementUID];
                }
                if (config._isPopupTabIndexManagementEnabled) {
                    if (previousTabIndex === "") {
                        $item.removeAttr("tabindex");
                    } else {
                        $item.attr({
                            'tabindex': previousTabIndex
                        });
                    }
                }
                if (config._isPopupAriaHiddenManagementEnabled) {
                    if (previousAriaHidden === "") {
                        $item.removeAttr("aria-hidden");
                    } else {
                        $item.attr({
                            'aria-hidden': previousAriaHidden
                        });
                    }
                }
            }.bind(this));
            return document.activeElement = this._focusStack.pop();
        }

    });

    return Popup;

});
