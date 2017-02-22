'use strict'

const KEY_CODE_UP = 38
const KEY_CODE_DOWN = 40
const KEY_CODE_ENTER = 13

class Search {

    constructor() {

        this.$ = {}
        this.$.searchContainer = $('.js-search')
        this.$.searchInput = this.$.searchContainer.find('input')
        this.$.searchedList = this.$.searchContainer.find('ul')
        this.$.anchorList = $('nav ul li a')
        this.$.selected = $()
        this.events()
    }


    clear() {
        this.$.searchedList.html('')
        this.$.searchInput.val('')
        this.$.selected = $()
    }


    events() {
        // Remove the search list when clicking outside the working area.
        $(window).on('click', (event) => {
            if (!this.$.searchContainer[0].contains(event.target)) {
                this.clear()
            }
        })

        // Clicking on a searchlist item will go to that page.
        this.$.searchedList.on('click', 'li', (event) => {
            var currentTarget = event.currentTarget
            var url = $(currentTarget).find('a').attr('href')
            this.moveToPage(url)
        })


        this.$.searchInput.on('keyup', (event) => {
            var inputText = this.removeWhiteSpace(this.$.searchInput.val()).toLowerCase()

            if (event.keyCode === KEY_CODE_UP || event.keyCode === KEY_CODE_DOWN) {
                return
            }

            if (!inputText) {
                this.$.searchedList.html('')
                return
            }

            if (event.keyCode === KEY_CODE_ENTER) {
                if (!this.$.selected.length) {
                    this.$.selected = this.$.searchedList.find('li').first()
                }
                this.moveToPage(this.$.selected.find('a').attr('href'))
                return
            }

            this.setList(inputText)
        })


        this.$.searchInput.on('keydown', (event) => {
            this.$.selected.removeClass('highlight')

            switch (event.keyCode) {
            case KEY_CODE_UP:
                this.$.selected = this.$.selected.prev()
                if (!this.$.selected.length) {
                    this.$.selected = this.$.searchedList.find('li').last()
                }
                break
            case KEY_CODE_DOWN:
                this.$.selected = this.$.selected.next()
                if (!this.$.selected.length) {
                    this.$.selected = this.$.searchedList.find('li').first()
                }
                break
            default: break
            }

            this.$.selected.addClass('highlight')
        })
    }


    isMatched(itemText, inputText) {
        return this.removeWhiteSpace(itemText).toLowerCase().indexOf(inputText) > -1
    }


    moveToPage(url) {
        if (url) {
            window.location = url
        }
        this.clear()
    }


    makeListItemHtml(item, inputText) {
        var itemText = item.text
        var itemHref = item.href
        var $parent = $(item).closest('div')
        var memberof = ''

        if ($parent.length && $parent.attr('id')) {
            memberof = $parent.attr('id').replace('_sub', '')
        } else {
            memberof = $(item).closest('div').find('h3').text()
        }

        if (memberof) {
            memberof = `<span class="group">${memberof}</span>`
        }

        itemText = itemText.replace(new RegExp(inputText, 'ig'), (matched) => {
            return `<strong>${matched}</strong>`
        })

        return `<li><a href="${itemHref}">${itemText}</a>${memberof}</li>`
    }


    setList(inputText) {
        var html = ''

        this.$.anchorList.filter((idx, item) => {
            return this.isMatched(item.text, inputText)
        }).each((idx, item) => {
            html += this.makeListItemHtml(item, inputText)
        })
        this.$.searchedList.html(html)
    }

    removeWhiteSpace(value) {
        return value.replace(/\s/g, '');
    }
}

module.exports = Search
