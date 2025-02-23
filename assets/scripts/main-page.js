"use strict";

var TemplateHelper = {
    Init: function() {
        var a = this;
        this.EventManager.registerEvent("displayMovement"), this.Component.Init(a), $(window).bind("resize scroll", function() {
            a.EventManager.triggerEvent("displayMovement")
        })
    }
};

TemplateHelper.EventManager = {
    eventList: {},
    init: function() {},
    registerEvent: function(a) {
        "undefined" == typeof this.eventList[a] && (this.eventList[a] = [])
    },
    unRegisterEvent: function(a) {
        "undefined" != typeof this.eventList[a] && delete this.eventList[a]
    },
    triggerEvent: function(a, b) {
        if (b = "undefined" != typeof b ? b : {}, "undefined" != typeof this.eventList[a]) {
            var c = this.eventList[a];
            for (var d in c) {
                var e = c[d],
                    f = e.method;
                e.object[f].call(e.object, b)
            }
        }
    },
    listenEvent: function(a, b, c) {
        "undefined" == typeof this.eventList[a] && this.registerEvent(a), this.eventList[a][this.eventList[a].length] = {
            object: b,
            method: c
        }
    }
}, TemplateHelper.Component = {
    activeComponents: {},
    templateHelperInstance: {},
    Init: function(a) {
        this.templateHelperInstance = a;
        var b = this;
        $.each(this.templateHelperInstance.Components, function(a, c) {
            $(c.containerIdentifier).each(function() {
                b.Factory($(this), a)
            })
        })
    },
    Factory: function(a, b) {
        "undefined" == typeof this.activeComponents[b] && (this.activeComponents[b] = []);
        var c = $.extend(1, this.templateHelperInstance.Components[b], {});
        c.Init(a, this.templateHelperInstance), this.activeComponents[b][this.activeComponents[b].length] = c
    }
}, TemplateHelper.Components = {
    Slider: {
        templateHelperInstance: {},
        alias: "component_slider",
        containerObject: {},
        containerIdentifier: ".component-slider",
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.handleDisplay(), this.templateHelperInstance.EventManager.listenEvent("displayMovement", this, "handleDisplay")
        },
        handleDisplay: function() {
            this.containerObject.find(".carousel-inner > .item").css("height", $(window).height())
        }
    },
    Menu: {
        templateHelperInstance: {},
        alias: "component_menu",
        containerObject: {},
        containerIdentifier: ".component-navigation",
        Init: function(a, b) {
            var c = this;
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.containerObject.attr("data-initial-height", this.containerObject.height()), this.containerObject.find("li a").on('click', function(a) {
                var b = $($(this).attr("href"));
                if (b.length > 0) {
                    a.preventDefault();
                    var d = b.offset().top;
                    c.containerObject.height() < d && (d -= c.containerObject.height() + 10), $("html, body").animate({
                        scrollTop: d
                    }, 1e3)
                }
            }), this.handleDisplay(), this.templateHelperInstance.EventManager.listenEvent("displayMovement", this, "handleDisplay")
        },
        handleDisplay: function() {
            var a = this.containerObject.offset().top,
                b = this.containerObject.height();
            if (this.containerObject.hasClass("fixed") && (a = parseInt(this.containerObject.attr("data-initial-top-position")), a < 0 && (this.containerObject.removeClass("fixed"), a = this.containerObject.offset().top, this.containerObject.attr("data-initial-top-position", a), this.containerObject.addClass("fixed"))), $(document).scrollTop() > a) {
                if (this.containerObject.hasClass("fixed")) return;
                this.containerObject.attr("data-initial-top-position", a), this.containerObject.addClass("fixed"), this.containerObject.prev().hasClass("component-primary-line-separator") && (this.containerObject.prev().addClass("fixed"), this.containerObject.addClass("with-top-separator")), $("body").css("padding-top", parseFloat($("body").css("padding-top")) + b)
            } else this.containerObject.prev().hasClass("component-primary-line-separator") && (this.containerObject.prev().removeClass("fixed"), this.containerObject.removeClass("with-top-separator")), this.containerObject.removeClass("fixed"), $("body").css("padding-top", 0)
        }
    },
    SeparatorMilestone: {
        templateHelperInstance: {},
        alias: "component-milestone-counters-1",
        containerObject: {},
        containerIdentifier: ".milestone",
        containerServedClass: "served",
        displayedNumberIdentifier: "p.number > span",
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.handleDisplay(), this.templateHelperInstance.EventManager.listenEvent("displayMovement", this, "handleDisplay")
        },
        handleDisplay: function() {
            if (!this.containerObject.hasClass(this.containerServedClass)) {
                var a = $(window).scrollTop() + window.innerHeight;
                if (a >= this.containerObject.offset().top && a <= this.containerObject.offset().top + window.innerHeight) {
                    this.containerObject.addClass(this.containerServedClass), this.containerObject.find(this.displayedNumberIdentifier).each(function() {
                        var a = $(this),
                            b = parseInt($(this).text(), 10);
                        $({
                            until: 0
                        }).animate({
                            until: b
                        }, {
                            duration: 2e3,
                            step: function() {
                                a.text(Math.ceil(this.until))
                            }
                        })
                    })
                }
            }
        }
    },
    SeparatorProgress: {
        templateHelperInstance: {},
        alias: "component_separator_progress",
        containerObject: {},
        containerIdentifier: ".component-separator-progress",
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.containerObject.find(".progress-bar-round[data-progress]").each(function() {
                $(this).append('<input type="text" data-skin="tron" value="' + $(this).attr("data-progress") + '"/>'), $(this).find('input[value="' + $(this).attr("data-progress") + '"]').knob({
                    readOnly: !0,
                    fgColor: "#FFFFFF",
                    bgColor: "transparent",
                    lineCap: "rounded",
                    thickness: .1,
                    width: 100,
                    height: 100
                })
            })
        }
    },
    ProgressBar: {
        templateHelperInstance: {},
        alias: "separator-progress",
        containerObject: {},
        containerIdentifier: ".progress-bar",
        containerServedClass: "served",
        from: 0,
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.from = parseInt(this.containerObject.attr("aria-valuenow"), 10), this.containerObject.attr("aria-valuenow", 0), this.containerObject.css("width", 0), this.handleDisplay(), this.templateHelperInstance.EventManager.listenEvent("displayMovement", this, "handleDisplay")
        },
        handleDisplay: function() {
            if (!this.containerObject.hasClass(this.containerServedClass)) {
                var a = $(window).scrollTop() + window.innerHeight;
                if (a >= this.containerObject.offset().top && a <= this.containerObject.offset().top + window.innerHeight) {
                    this.containerObject.addClass(this.containerServedClass);
                    var b = this.containerObject,
                        c = this.from;
                    $({
                        until: 0
                    }).animate({
                        until: c
                    }, {
                        duration: 1e3,
                        step: function() {
                            b.attr("aria-valuenow", Math.ceil(this.until)), b.css("width", Math.ceil(this.until) + "%")
                        }
                    })
                }
            }
        }
    },
    SeparatorQuotation: {
        templateHelperInstance: {},
        alias: "component_separator_quotation",
        containerObject: {},
        containerIdentifier: ".component-separator-quotation",
        quotationListObject: {},
        quotationListIdentifier: " ul > li",
        quotationDisplayEffect: "slideInLeft",
        quotationHideEffect: "slideOutRight",
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.quotationListObject = this.containerObject.find(this.quotationListIdentifier), this.quotationListObject.not(":first").hide(), this.quotationListObject.eq(0).addClass("current");
            var c = this;
            setInterval(function() {
                c.displayNextQuotation()
            }, 6e3)
        },
        displayNextQuotation: function() {
            var a = this,
                b = this.quotationListObject.length,
                c = this.quotationListObject.filter(".current").index(),
                d = c + 1;
            d + 1 > b && (d = 0), this.quotationListObject.eq(c).removeClass("current animated " + this.quotationDisplayEffect).addClass("animated " + this.quotationHideEffect), setTimeout(function() {
                a.quotationListObject.eq(c).hide(), a.quotationListObject.eq(d).removeClass("animated " + a.quotationHideEffect).show().addClass("animated current " + a.quotationDisplayEffect)
            }, 500)
        }
    },
    SeparatorNotification: {
        templateHelperInstance: {},
        alias: "component_separator_notification",
        containerObject: {},
        containerIdentifier: ".component-separator-notification",
        notificationListObject: {},
        notificationListIdentifier: " ul > li",
        notificationDisplayEffect: "slideInLeft",
        notificationHideEffect: "slideOutRight",
        Init: function(a, b) {
            this.containerObject = a, this.templateHelperInstance = b, this.containerObject.data(this.alias, this), this.notificationListObject = this.containerObject.find(this.notificationListIdentifier), this.notificationListObject.not(":first").hide(), this.notificationListObject.eq(0).addClass("current");
            var c = this;
            setInterval(function() {
                c.displayNextNotification()
            }, 10e3)
        },
        displayNextNotification: function() {
            var a = this,
                b = this.notificationListObject.length,
                c = this.notificationListObject.filter(".current").index(),
                d = c + 1;
            d + 1 > b && (d = 0), this.notificationListObject.eq(c).removeClass("current animated " + this.notificationDisplayEffect).addClass("animated " + this.notificationHideEffect), setTimeout(function() {
                a.notificationListObject.eq(c).hide(), a.notificationListObject.eq(d).removeClass("animated " + a.notificationHideEffect).show().addClass("animated current " + a.notificationDisplayEffect)
            }, 500)
        }
    }
};

$(document).ready(function() {
    TemplateHelper.Init()
});

$(function() {
    var $frame = $('#gallery');
    var $slidee = $frame.children('ul').eq(0);
    var $wrap = $frame.parent();

    // Call Sly on frame
    $frame.sly({
        horizontal: 1,
        itemNav: 'basic',
        smart: 1,
        activateOn: 'click',
        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: 0,
        scrollBar: $wrap.find('.scrollbar'),
        scrollBy: 1,
        pagesBar: $wrap.find('.pages'),
        activatePageOn: 'click',
        speed: 500,
        elasticBounds: 1,
        easing: 'easeOutExpo',
        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1
    });

    // To Start button
    $wrap.find('.toStart').on('click', function() {
        var item = $(this).data('item');
        // Animate a particular item to the start of the frame.
        // If no item is provided, the whole content will be animated.
        $frame.sly('toStart', item);
    });

    // To Center button
    $wrap.find('.toCenter').on('click', function() {
        var item = $(this).data('item');
        // Animate a particular item to the center of the frame.
        // If no item is provided, the whole content will be animated.
        $frame.sly('toCenter', item);
    });

    // To End button
    $wrap.find('.toEnd').on('click', function() {
        var item = $(this).data('item');
        // Animate a particular item to the end of the frame.
        // If no item is provided, the whole content will be animated.
        $frame.sly('toEnd', item);
    });

    // Add item
    $wrap.find('.add').on('click', function() {
        $frame.sly('add', '<li>' + $slidee.children().length + '</li>');
    });

    // Remove item
    $wrap.find('.remove').on('click', function() {
        $frame.sly('remove', -1);
    });
}());