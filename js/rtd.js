'use strict'

const CodeHighlight = require('./code_highlight')
const Search = require('./search')


class RTD {

    constructor() {
        this.$ = {}

        this.$.main = $('#main')
        this.$.nav = $('nav')
        this.$.resizer = $('#resizer')

        this.$.apiTab = $('#api-tab')
        this.$.examplesTab = $('#examples-tab')

        // Targets the current page in the navigation.
        if (selectedApiId) {
            // This is the methods container in the navigation.
            this.$.selectedApi = $(`#${selectedApiId}`)
            this.$.selectedApi.removeClass('hidden')

            // Add the selected class on the link.
            this.$.selectedApi.prev().addClass('selected')
            this.$.selectedApi.parent().find('.fa').removeClass('fa-plus').addClass('fa-minus')
        }

        this.showApiTab()
        this.codehighlight = new CodeHighlight()
        this.search = new Search()

        if (isManual) {
            this.showManualsTab()
        }

        this.setSubNavSelected()

        this.events()
    }


    events() {
        this.$.apiTab.on('click', this.showApiTab.bind(this))
        this.$.examplesTab.on('click', this.showManualsTab.bind(this))

        this.$.nav.find('.nav-api').each(function() {
            $(this).find('.toggle-subnav')
                .filter(function() {
                    // Keeps subnavs without items invisible.
                    return $(this).next().next(':empty').length === 0;
                }).each(function() {
                    $(this).removeClass('invisible').on('click', function(e) {
                        $(e.currentTarget).next().next().toggleClass('hidden')
                        $(e.currentTarget).toggleClass('fa-plus fa-minus')
                    })
                })
        })

        function resize(event) {
            var clientX = event.clientX
            clientX = Math.max(200, clientX)
            clientX = Math.min(500, clientX)
            this.$.nav.css('width', clientX)
            this.$.resizer.css('left', clientX)
            this.$.main.css('left', clientX + this.$.resizer.width())
        }

        function detachResize() {
            $(window).off({mousemove: resize, mouseup: detachResize})
        }

        this.$.resizer.on('mousedown', function() {
            $(window).on({mousemove: resize, mouseup: detachResize})
        })

        window.addEventListener('hashchange', this.setSubNavSelected.bind(this), false)
    }

    /**
     * The manual tab.
     */
    showManualsTab() {
        this.$.apiTab.removeClass('selected')
        this.$.examplesTab.addClass('selected')
        $('.nav-api').addClass('hidden')
        $('.lnb-examples').removeClass('hidden')
    }

    /**
     * The API tab.
     */
    showApiTab() {
        this.$.examplesTab.removeClass('selected')
        this.$.apiTab.addClass('selected')
        $('.nav-api').removeClass('hidden')
        $('.lnb-examples').addClass('hidden')
    }


    /**
     * Selected item in the sub navigation.
     */
    setSubNavSelected() {
        $('.sub-nav-item a').removeClass('selected')
        let item = document.querySelector(`a[href$="${location.pathname.substr(1)}${location.hash}"]`)
        $(item).addClass('selected')
    }
}

$(() => {
    window.rtd = new RTD()
})
