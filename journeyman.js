function tumblrNotesInserted() {
    if ($(".more_notes_link").length) {
        Optica.LOADING_NOTES = false
    } else {
        Optica.DONE_LOADING_NOTES = true
    }
} 

(function (j_query, optica) {
    var utils = {
        init: function () {
            this.globals();
            this.devices();
            this.like_button();
            this.in_iframe();
            this.devices();
            this.like_button();
            this.link_color();
            this.description_color();
            if (j_query(".header-image").length) {
                this.load_header()
            }
            if (Function("/*@cc_on return document.documentMode===10@*/")()) {
                Optica.$body.addClass("ie10")
            }
        },
        globals: function () {
            Optica.$win = j_query(window);
            Optica.$doc = j_query(document);
            Optica.$body = j_query("body");
            Optica.$win_body = j_query("html, body")
        },
        in_iframe: function () {
            if (window.self !== window.top) {
                Optica.$body.addClass("iframe")
            }
        },
        is_touch_device: function () {
            return !!("ontouchstart" in window) || !!window.navigator.msMaxTouchPoints
        },
        load_header: function () {
            var header_img_div = j_query(".header-image");
            if (Optica.$body.hasClass("iframe") || Optica.$body.hasClass("touch")) {
                header_img_div.css({
                    opacity: 1
                }).addClass("loaded")
            } else {
                var bg_img_url = header_img_div.data("bg-image");
                var bg_img = new Image;
                j_query(bg_img).bind("load", function (event) {
                    header_img_div.addClass("loaded")
                });
                bg_img.src = bg_img_url
            }
        },
        like_button: function () {
            j_query("#posts").on("mouseenter touchstart", ".like_button", function (event) {
                var n = j_query(event.currentTarget);
                if (!n.hasClass("liked")) n.addClass("interacted")
            })
        },
        link_color: function () {
            var accent_color = Optica.Utils.hex_to_hsv(Optica.ACCENT_COLOR);
            var bg_color = Optica.Utils.hex_to_hsv(Optica.BACKGROUND_COLOR);
            if (accent_color.s < .2 && accent_color.v > .8) {
                Optica.$body.addClass("light-accent");
                if (bg_color.s < .2 && bg_color.v > .8) {
                    Optica.$body.addClass("light-on-light")
                }
            }
            if (accent_color.v < .2 && bg_color.v < .2) {
                Optica.$body.addClass("dark-on-dark")
            }
        },
        description_color: function () {
            var description_div = j_query(".title-group .description");
            if (!description_div.length) return;
            var title_color = Optica.Utils.hex_to_rgb(Optica.TITLE_COLOR);
            description_div.css({
                color: "rgba(" + title_color.r + "," + title_color.g + "," + title_color.b + ", 0.7)"
            })
        },
        devices: function () {
            //var e;
            var user_agent = navigator.userAgent;
            var match;
            var ver;
            if (this.is_touch_device()) {
                Optica.$body.addClass("touch");
                if (!Optica.$body.hasClass("permalink")) {
                    setTimeout(function () {
                        window.scrollTo(0, 1)
                    }, 1)
                }
            }
            if (user_agent.match(/(iPhone|iPod|iPad)/)) {
                this.ios()
            } else if (n = user_agent.match(/Android\s([0-9\.]*)/)) {
                ver = match[1];
                Optica.$body.addClass("android");
                if (parseFloat(ver) < 4.4) {
                    Optica.$body.addClass("android-lt-4-4")
                }
            }
        },
        ios: function () {
            Optica.$body.addClass("ios");
            j_query("#posts").on("click", "a.open-in-app", j_query.proxy(function (event) {
                event.preventDefault();
                var post_id = j_query(event.currentTarget).data("post");
                this.open_in_ios_app(post_id)
            }, this))
        },
        open_in_ios_app: function (post_id) {
            if (!post_id || typeof post_id !== "number") return;
            var url = "http://www.tumblr.com/open/app/?app_args=" + encodeURIComponent("blog?blogName=") + j_query("body").data("urlencoded-name") + encodeURIComponent("&postID=" + post_id + "&referrer=blog_popover");
            document.location = url
        },
        rgb_to_hex: function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        },
        hex_to_rgb: function (hex) {
            hex = (new String(hex)).replace(/[^0-9a-f]/gi, "");
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
            }
            var match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return match ? {
                r: parseInt(match[1], 16),
                g: parseInt(match[2], 16),
                b: parseInt(match[3], 16)
            } : null
        },
        rgb_to_hsv: function (e, t, n) { 
        	// variable names screwed up by going through minimize and back, but hard to descramble
            var r = Math.min(Math.min(e, t), n);
            var i = Math.max(Math.max(e, t), n);
            var s = i - r;
            var o = {
                h: 6,
                s: i ? (i - r) / i : 0,
                v: i / 255
            };
            if (!s) {
                o.h = 0
            } else if (i === e) {
                o.h += (t - n) / s
            } else if (i === t) {
                o.h += 2 + (n - e) / s
            } else {
                o.h += 4 + (e - t) / s
            }
            o.h = 60 * o.h % 360;
            return o
        },
        hsv_to_rgb: function (e, t, n) {
            // variable names screwed up by going through minimize and back, but hard to descramble
            var r, i, s;
            if (!t) {
                r = i = s = n
            } else {
                r = i = s = 0;
                var o = (e + 360) % 360 / 60;
                var u = n * t;
                var a = n - u;
                var f = u * (1 - Math.abs(o % 2 - 1));
                if (o < 1) {
                    r = u;
                    i = f
                } else if (o < 2) {
                    r = f;
                    i = u
                } else if (o < 3) {
                    i = u;
                    s = f
                } else if (o < 4) {
                    i = f;
                    s = u
                } else if (o < 5) {
                    s = u;
                    r = f
                } else {
                    s = f;
                    r = u
                }
                r += a;
                i += a;
                s += a
            }
            return {
                r: Math.round(255 * r),
                g: Math.round(255 * i),
                b: Math.round(255 * s)
            }
        },
        hex_to_hsv: function (n) {
            // variable names screwed up by going through minimize and back, but hard to descramble
            n = (new String(n)).replace(/[^0-9a-f]/gi, "");
            if (n.length < 6) {
                n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]
            }
            var r = optica.Utils.hex_to_rgb(n);
            var i = j_query.map(r, function (e) {
                return e
            });
            var s = optica.Utils.rgb_to_hsv.apply(optica.Utils, i);
            return s
        },
        hsv_to_hex: function (n, r, i) {
        	// variable names screwed up by going through minimize and back, but hard to descramble
            var s = t.Utils.hsv_to_rgb(n, r, i);
            var o = e.map(s, function (e) {
                return e
            });
            var u = t.Utils.rgb_to_hex.apply(t.Utils, o);
            return u
        },
        hex_brightness: function (e, t) {
        	// variable names screwed up by going through minimize and back, but hard to descramble
            e = String(e).replace(/[^0-9a-f]/gi, "");
            if (e.length < 6) {
                e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]
            }
            t = t || 0;
            var n = parseInt(e, 16),
                r = t < 0 ? 0 : 255,
                i = t < 0 ? -t : t,
                s = n >> 16,
                o = n >> 8 & 255,
                u = n & 255,
                a, f, l;
            a = Math.round((r - s) * i) + s;
            f = Math.round((r - o) * i) + o;
            l = Math.round((r - u) * i) + u;
            return "#" + (16777216 + a * 65536 + f * 256 + l).toString(16).slice(1)
        }
    };
    var request_frame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (animate_fn) {
            window.setTimeout(animate_fn, 1e3 / 20)
        }
    }();
    var eventor = {
        init: function () {
            this.tick = false;
            this.event_loop()
        },
        event_loop: function () {
            Optica.$win.on("scroll.Eventor:next-frame", j_query.proxy(function () {
                if (!this.tick) {
                    request_frame(j_query.proxy(this.next_frame, this));
                    this.tick = true
                }
            }, this))
        },
        next_frame: function (j_query) {
            Optica.$win.trigger("Eventor:scroll");
            this.tick = false
        }
    };
    var drawer = function (selector, options) {
        if (!(this instanceof drawer)) {
            return new drawer(selector, options)
        }
        this.el = typeof selector === "string" ? j_query(selector).get(0) : selector;
        this.$el = j_query(selector);
        this.options = options;
        this.metadata = this.$el.data("plugin-options");
        this.config = j_query.extend({}, drawer.defaults, this.options, this.metadata);
        this.trigger = this.config.trigger || false;
        this.$trigger = j_query(this.config.trigger) || this.$el;
        this.bind_events();
        return this
    };
    drawer.prototype = {
        __mouse_enter: function (e) {
            this.show(j_query(e.currentTarget))
        },
        __mouse_leave: function (e) {
            this.hide(j_query(e.currentTarget))
        },
        bind_events: function () {
            this.$el.on("mouseenter", this.trigger, j_query.proxy(this.__mouse_enter, this));
            this.$el.on("mouseleave", this.trigger, j_query.proxy(this.__mouse_leave, this))
        },
        show: function (e) {
            clearTimeout(this.leave_delay);
            j_query(this.trigger).removeClass("active");
            e.addClass("active")
        },
        hide: function (e) {
            Optica.Popmenu.hide_all();
            this.leave_delay = setTimeout(j_query.proxy(function () {
                e.removeClass("active");
                clearTimeout(this.leave_delay)
            }, this), this.config.forgiveness_delay)
        }
    };
    drawer.defaults = {
        forgiveness_delay: 0
    };
    j_query.fn.drawer = function (options) {
        return this.each(function () {
            new drawer(this, options)
        })
    };
    var iframe = function (selector, options, callback) {
        if (!(this instanceof iframe)) {
            return new iframe(selector, options, callback)
        }
        this.el = typeof selector === "string" ? j_query(selector).get(0) : selector;
        this.$el = j_query(selector);
        this.config = j_query.extend({}, iframe.defaults, options);
        this.callback = callback || function () {};
        this.successes = 0;
        this.errors = 0;
        this.items = [];
        this.get_items();
        return this
    };
    iframe.prototype = {
        get_items: function () {
            this.items = this.el.querySelectorAll(this.config.selector);
            if (!this.items.length) this.callback();
            for (var i = 0, n = this.items.length; i < n; i++) {
                this.re_load(j_query(this.items[i]))
            }
        },
        re_load: function (element) {
            element.on("load", j_query.proxy(function () {
                this.successes += 1;
                if (this.done()) {
                    this.callback.apply(this)
                }
            }, this));
            element.on("error", function () {
                this.errors += 1
            });
            element.attr({
                src: element.attr("src")
            })
        },
        done: function () {
            return this.items.length === this.successes + this.errors
        }
    };
    iframe.defaults = {
        selector: "iframe"
    };
    j_query.fn.iframesLoaded = function (options, callback) {
        return this.each(function () {
            new iframe(this, options, callback)
        })
    };
    var popmenu = function (selector, options) {
        if (!(this instanceof popmenu)) {
            return new popmenu(selector, options)
        }
        this.el = typeof selector === "string" ? j_query(selector).get(0) : selector;
        this.$el = j_query(selector);
        this.options = options;
        this.metadata = this.$el.data("plugin-options");
        this.config = j_query.extend({}, popmenu.defaults, this.options, this.metadata);
        this.trigger = this.config.trigger;
        this.$trigger = this.$el.find(this.trigger);
        this.$search_input = j_query("#search input");
        this.events = {
            trigger_click: j_query.proxy(this.__trigger_click, this),
            document_click: j_query.proxy(this.__document_click, this),
            glass_click: j_query.proxy(this.__class_click, this),
            offset_scroll: j_query.proxy(this._check_offset, this)
        };
        this.bind_events();
        popmenu.register(this);
        return this
    };
    popmenu.prototype = {
        __document_click: function (e) {
            var n = j_query(e.target);
            if (this.$popover && this.$popover.hasClass("active") && !this.$el.has(n.parents(this.config.container)).length) {
                this.hide()
            }
        },
        __trigger_click: function (e) {
            e.preventDefault();
            this.$trigger = j_query(e.currentTarget);
            this.$container = this.$trigger.parents(this.config.container);
            this.$glass = this.$container.siblings(this.config.glass);
            this.$popover = this.$trigger.siblings(this.config.popopver);
            if (!this.$popover.hasClass("active")) {
                this.show()
            } else {
                this.hide()
            }
        },
        _check_offset: function () {
            if (Math.abs(this.scroll_offset - Optica.$win.scrollTop()) > this.config.scroll_distance) {
                if (!this.$search_input.is(":focus")) {
                    this.hide()
                }
            }
        },
        bind_events: function () {
            this.$el.on("touchstart click", this.trigger, this.events.trigger_click);
            Optica.$doc.on("click", this.events.document_click)
        },
        unbind_events: function () {
            this.$el.off("click", this.trigger, this.events.trigger_click);
            Optica.$doc.off("click", this.events.document_click)
        },
        destroy: function () {},
        show: function () {
            if (this.$glass) this.$glass.addClass("active");
            this.$popover.parents("article").addClass("visible");
            this.$popover.addClass("show");
            this.$trigger.addClass("show");
            setTimeout(j_query.proxy(function () {
                this.$trigger.addClass("active");
                this.$container.addClass("active");
                this.$popover.addClass("active");
                this.scroll_offset = Optica.$win.scrollTop();
                Optica.$win.on("Eventor:scroll", this.events.offset_scroll)
            }, this), 10)
        },
        hide: function (delay) {
            this.$search_input.blur();
            var popover = this.$el.find(this.config.popover);
            var trigger = this.$el.find(this.config.trigger);
            Optica.$win.off("Eventor:scroll", this.events.offset_scroll);
            if (this.$glass) this.$glass.removeClass("active");
            if (this.$container) this.$container.removeClass("active");
            trigger.removeClass("active");
            popover.removeClass("active");
            popover.each(function () {
                j_query(this).parents("article").removeClass("visible")
            });
            setTimeout(j_query.proxy(function () {
                trigger.removeClass("show");
                popover.removeClass("show")
            }, this), delay ? 0 : 250)
        }
    };
    popmenu.instances = [];
    popmenu.defaults = {
        container: ".pop",
        trigger: ".selector",
        popover: ".pop-menu",
        use_glass: false,
        glass: ".glass",
        scroll_distance: 50
    };
    popmenu.register = function (menu) {
        this.instances.push(menu)
    };
    popmenu.hide_all = function () {
        for (var i = 0; i < this.instances.length; i++) {
            this.instances[i].hide(true)
        }
    };
    j_query.fn.popmenu = function (options) {
        return this.each(function () {
            new popmenu(this, options)
        })
    };
    var notes_pager = {
        __window_scroll: function () {
            if (Optica.DONE_LOADING_NOTES) {
                this.unbind_events()
            }
            if (this._near_bottom() && !Optica.LOADING_NOTES) {
                this.load_notes()
            }
        },
        _near_bottom: function () {
            return Optica.$doc.height() - Optica.$win.scrollTop() < Optica.$win.height() * 3
        },
        init: function () {
            Optica.LOADING_NOTES = false;
            this.events = {
                scroll: j_query.proxy(this.__window_scroll, this)
            };
            this.bind_events()
        },
        bind_events: function () {
            Optica.$win.on("Eventor:scroll", this.events.scroll)
        },
        unbind_events: function () {
            Optica.$win.off("Eventor:scroll", this.events.scroll)
        },
        load_notes: function () {
            Optica.LOADING_NOTES = true;
            j_query(".more_notes_link").trigger("click")
        }
    };
    var pager = function (selector, options) {
        if (!(this instanceof pager)) {
            return new pager(selector, options)
        }
        this.el = typeof selector === "string" ? j_query(selector).get(0) : selector;
        this.$el = j_query(selector);
        this.config = j_query.extend({}, pager.defaults, options);
        if (!this.config.$pagination && !this.config.$pagination.length) return;
        this.current_page = this.config.$pagination.data("current-page");
        this.next_page_number = this.current_page + 1;
        this.total_pages = this.config.$pagination.data("total-pages");
        this.base_url = this.config.$pagination.attr("href");
        if (this.base_url) this.base_url = this.base_url.substring(0, this.base_url.lastIndexOf("/")) + "/";
        this.loading_data = false;
        this.is_scrolling = false;
        this.body_timeout = -1;
        this.cache_selectors();
        this.bind_events();
        if (this.config.endless_scrolling && this.config.$pagination.length) {
            this.config.$pagination.addClass("invisible");
            this.init = true;
        } else {
            this.init = false;
        } 
        this.update_body();
        this.remove_empty_quotes();
        this.update_spotify();
        this.set_embed_size(j_query('.video-wrapper iframe[src^="//instagram"]'));
        this.update_video_player(j_query(".tumblr_video_container, .video-embed iframe"));
        this.update_iframes();
        if (Optica.$body.hasClass("narrow")) this.upscale_images();
        this.set_body_type();
        pager.register(this);
        return this
    };
    pager.prototype = {
        __document_keydown: function (key) {
            var code = key.charCode ? key.charCode : key.keyCode;
            var target = key ? key.target : window.event.srcElement;
            if (j_query(target).is("input:focus") || this.is_grid_layout) return;
            if (code === 74) {
                this.next_post()
            } else if (code === 75) {
                this.previous_post()
            } else if (code === 190) {
                Optica.$win_body.animate({
                    scrollTop: 0
                })
            }
        },
        __window_resize: function () {
            this.set_body_type();
            if (!this.is_grid_layout) this.update_spotify();
            this.update_video_player(j_query(".tumblr_video_container, .video-embed iframe"));
            this.update_iframes()
        },
        __window_scroll: function () {
            if (Optica.$body.hasClass("touch")) this.update_body();
            if (!this.is_scrolling) {
                Optica.$body.addClass("is-scrolling");
                this.is_scrolling = true
            }
            clearTimeout(this.body_timeout);
            this.body_timeout = setTimeout(j_query.proxy(function () {
                Optica.$body.removeClass("is-scrolling");
                this.is_scrolling = false
            }, this), 200);
            if (!this.init) return;
            if (this._near_bottom() && !this.loading_data) {
                this.next_page()
            }
        },
        _debounce: function (func, params) {
            var timeout_id = null;
            return function () {
                var args = arguments;
                clearTimeout(timeout_id);
                timeout_id = setTimeout(j_query.proxy(function () {
                    func.apply(this, args)
                }, this), params)
            }
        },
        _throttle: function (func, wait, this_arg) {
            wait || (wait = 250);
            var prev_time;
            var timeout_id;
            return function () {
                var this_arg_internal = this_arg || this;
                var time = +(new Date);
                var args = arguments;
                if (prev_time && time < prev_time + wait) {
                    clearTimeout(timeout_id);
                    timeout_id = setTimeout(function () {
                        prev_time = time;
                        func.apply(this_arg_internal, args);
                    }, wait);
                } else {
                    prev_time = time;
                    func.apply(this_arg_internal, args);
                }
            }
        },
        _get_window_bounds: function () {
            this.window_height = Optica.$win.height()
        },
        _get_post_bounds: function (post) {
            return j_query.data(post[0], "offsets")
        },
        _set_post_bounds: function (post) {
            var top = post.offset().top;
            var height = post.outerHeight();
            var bottom = top + height;
            return j_query.data(post[0], "offsets", {
                top: top,
                height: height,
                bottom: bottom
            });
        },
        _in_view: function (post) {
            var bounds;
            var position = Optica.$win.scrollTop();
            this.window_height = this.window_height || Optica.$win.height();
            var window_bottom = position + this.window_height;
            bounds = this._get_post_bounds(post);
            if (!bounds) {
                bounds = this._set_post_bounds(post);
            }
            if (bounds.bottom + this.window_height < position || bounds.top > window_bottom + this.window_height) {
                return false;
            } else {
                return true;
            }
        },
        _snooze: function (e) {
            e.addClass("snooze");
        },
        _wake: function (e) {
            e.removeClass("snooze");
        },
        _near_bottom: function () {
            var offset = this.is_grid_layout ? 1.25 : 3;
            return Optica.$doc.height() - this.$el.scrollTop() < this.$el.height() * offset;
        },
        _near_top: function () {
            return !!(Optica.$win.scrollTop() < 50);
        },
        _slender: function () {
            if (Optica.$win.width() < 720) {
                return true;
            }
            return false;
        },
        _get_next_page: function () {
            this.show_loader();
            var ajax = j_query.ajax({
                url: this.base_url + this.next_page_number,
                dataType: "html"
            });
            ajax.done(j_query.proxy(this._append_new_posts, this));
            ajax.fail(j_query.proxy(this._failed, this))
        },
        _failed: function () {
            this.hide_loader(true)
        },
        _append_new_posts: function (context) {
        	// pages are the <div>s immediately below the #posts <section> 
        	// individual posts are <article> elements within a page <div>
        	// context is typically the ajax return
        	// get the pages and posts in the context
            var pages = j_query(context).find("#posts > div");
            var articles = pages.children();
            var post_ids = [];
            
            // add the pages from the context to the main document
            this.config.$target.append(pages);
            addMarkers(articles);
            
            // cleanup of various post elements
            this.set_embed_size(articles.find('.video-wrapper iframe[src^="//instagram"]'));
            this.update_video_player(articles.find(".tumblr_video_container, .video-embed iframe"));
            this.update_iframes(pages);
            this.remove_empty_quotes(pages);
            this.update_spotify(pages);
            setLastPost(j_query('article'));
            if (Optica.$body.hasClass("narrow")) this.upscale_images(pages);
            
            this.loading_data = false;
            this.hide_loader();
            
            // setup Tumblr liking for the new posts
            articles.each(j_query.proxy(function (index, el) {
                post_ids.push(j_query(el).find(".like_button").data("post-id"))
            }, this));
            Tumblr.LikeButton.get_status_by_post_ids(post_ids);
            
            if (window.ga) {
                ga("send", "pageview", {
                    page: "/page/" + this.next_page_number,
                    title: "Index Page -- Ajax Load"
                })
            }
            
            this.current_page = this.next_page_number;
            this.next_page_number++;
        },
        cache_selectors: function () {
            this.$html = j_query("html");
            this.$header = j_query("#header");
            this.$posts = j_query("#posts")
        },
        animate: function () {
            if (this.go_to_position && !this.animating) {
                this.animating = true;
                // var t = 0;
                j_query("html,body").stop().animate({
                    scrollTop: this.go_to_position - 10
                }, 250, j_query.proxy(function () {
                    this.animating = false
                }, this))
            }
        },
        set_masonry: function () {
            var post_container = j_query("#posts");
            var articles = posts.find("article");
            post_container.imagesLoaded(j_query.proxy(function () {
                post_container.iframesLoaded({
                    selector: "iframe.photoset"
                }, j_query.proxy(function () {
                    post_container.masonry({
                        itemSelector: "article",
                        isFitWidth: true
                    });
                    this.animate_posts(articles)
                }, this))
            }, this));
            this.is_grid_layout = true
        },
        animate_posts: function (posts) {
            posts.first().fadeTo(250, 1);
            if (posts.length > 0) {
                this.animate_timer = setTimeout(j_query.proxy(function () {
                    this.animate_posts(posts.slice(1))
                }, this), 25);
            } else {
                clearTimeout(this.animate_timer);
            }
        },
        next_post: function () {
            this.update_post_info();
            for (var i in this.post_positions) {
                var post_position = this.post_positions[i];
                if (post_position > this.current_position + 12 && (post_position < this.go_to_position || !this.go_to_position)) {
                    this.go_to_position = post_position;
                }
            }
            this.animate();
        },
        previous_post: function () {
            this.update_post_info();
            for (var i in this.post_positions) {
                var post_position = this.post_positions[i];
                if (post_position < this.current_position - 12 && post_position > this.go_to_position) {
                    this.go_to_position = post_position;
                }
            }
            this.animate()
        },
        set_body_type: function () {
            if (this._slender()) {
                Optica.$body.addClass("slender").removeClass("grid");
                if (Optica.GRID_LAYOUT && this.is_grid_layout) {
                    this.config.$target.css({
                        width: "auto"
                    });
                    this.config.$target.masonry("destroy");
                    this.is_grid_layout = false
                }
            } else {
                Optica.$body.removeClass("slender");
                if (Optica.GRID_LAYOUT && Optica.$body.hasClass("index-page")) {
                    Optica.$body.addClass("grid");
                    this.set_masonry()
                }
            }
        },
        update_body: function () {
            if (this._near_top()) {
                Optica.$body.addClass("top");
                Optica.$body.removeClass("below-header")
            } else {
                Optica.$body.removeClass("top");
                Optica.$body.addClass("below-header")
            }
        },
        update_post_info: function () {
            this.update_post_positions();
            this.current_position = window.pageYOffset || document.documentElement && document.documentElement.scrollTop || document.body.scrollTop;
            this.go_to_position = 0
        },
        update_post_positions: function () {
            var positions = {};
            j_query("#posts article").each(function () {
                var id = j_query(this).data("post-id");
                positions[id] = j_query(this).offset().top;
            });
            this.post_positions = positions;
        },
        bind_events: function () {
            this.$el.on("Eventor:scroll", j_query.proxy(this.__window_scroll, this));
            this.$el.on("resize orientationchange", j_query.proxy(this._debounce(this.__window_resize, this.config.resizeDelay), this));
            Optica.$doc.on("keydown", j_query.proxy(this.__document_keydown, this))
        },
        update_spotify: function (context) {
            var audio_width = j_query(".audio_container").width();
            var height = audio_width + 80;
            var frames = context && context.length ? j_query('iframe[src*="embed.spotify.com"]', context) : j_query('iframe[src*="embed.spotify.com"]');
            if (audio_width > 500) {
                frames.each(function () {
                    j_query(this).css({
                        width: audio_width,
                        height: height
                    });
                    j_query(this).attr("src", j_query(this).attr("src"))
                })
            } else {
                frames.each(function () {
                    j_query(this).css({
                        width: audio_width,
                        height: 80
                    });
                    j_query(this).attr("src", j_query(this).attr("src"))
                })
            }
        },
        upscale_images: function (context) {
            var imgs = context && context.length ? j_query(".photo figure:not(.high-res)", context) : j_query(".photo figure:not(.high-res)");
            imgs.each(function () {
                if (j_query(this).data("photo-width") > 420) j_query(this).addClass("high-res")
            })
        },
        set_embed_size: function (elements) {
            elements.each(function () {
                var this_el = j_query(this);
                if (!this_el.data("aspect-ratio")) {
                    var width = 612;
                    var height = 710;
                    var ratio = height / width;
                    this_el.attr("data-aspect-ratio", ratio);
                    this_el.width(n);
                    this_el.height(r)
                }
                j_query(this).parent().addClass("video-embed")
            })
        },
        update_video_player: function (videos) {
            videos.each(function () {
                var this_el = j_query(this);
                if (!this_el.data("aspect-ratio")) {
                    var ratio = this_el.height() / this_el.width();
                    this_el.attr("data-aspect-ratio", ratio);
                    this_el.css({
                        width: "100%"
                    });
                    this_el.css({
                        height: this_el.width() * ratio + "px"
                    });
                    j_query(this).parent().addClass("tumblr-video")
                } else {
                    this_el.css({
                        height: this_el.width() * this_el.data("aspect-ratio") + "px"
                    })
                }
            })
        },
        update_iframes: function (context) {
            if (!Optica.$body.hasClass("touch")) return;
            var frames = context && context.length ? j_query("iframe.tumblr_audio_player, iframe.photoset", context) : j_query("iframe.tumblr_audio_player, iframe.photoset");
            frames.each(function () {
                var this_el = j_query(this);
                var width = this_el.parent().width();
                this_el.attr("width", width).width(width)
            })
        },
        remove_empty_quotes: function (context) {
            j_query(".quote .post > blockquote p:empty", context).remove()
        },
        next_page: function () {
            if (this.total_pages < this.next_page_number) {
                this.hide_loader(true);
                return
            }
            this.loading_data = true;
            this.show_loader();
            this._get_next_page()
        },
        hide_loader: function (j_query) {
            if (j_query) this.config.$pagination.hide();
            this.config.$loader.removeClass("animate")
        },
        show_loader: function () {
            this.config.$loader.addClass("animate")
        }
    };
    pager.instances = [];
    pager.defaults = {
        bufferPx: 1e3,
        $pagination: j_query("#pagination"),
        $loader: j_query(".loader"),
        resizeDelay: 100,
        scrollDelay: 100,
        $target: j_query("#posts")
    };
    pager.register = function (new_pager) {
        this.instances.push(new_pager)
    };
    j_query.fn.pager = function (options) {
        return this.each(function () {
            new pager(this, options)
        })
    };
    optica.Utils = utils;
    optica.Eventor = eventor;
    optica.Popmenu = popmenu;
    optica.Drawer = drawer;
    optica.Pager = pager;
    optica.NotesPager = notes_pager
})(jQuery, Optica);

$(document).ready(function () {
    Optica.Utils.init();
    Optica.Eventor.init();
    var body = $("body");
    new Optica.Pager(window, {
        $pagination: $("#pagination a"),
        $loader: $("#pagination .loader"),
        endless_scrolling: Optica.ENDLESS_SCROLLING
    });
    $("body:not(.touch) #posts").drawer({
        trigger: "article:not(.exposed)"
    });
    $("#page").popmenu();
    if (body.hasClass("permalink") && $(".more_notes_link").length && Optica.ENDLESS_NOTES_SCROLLING) {
        Optica.NotesPager.init()
    }
})