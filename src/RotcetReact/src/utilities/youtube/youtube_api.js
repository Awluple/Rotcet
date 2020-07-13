import 'regenerator-runtime/runtime'

export default class YoutubeApi {
    // downloads YouTube api and oversees iframe loading
    constructor() {
        this.apiCalled = false
        this.isReady = false
        this.toCall = []
    }
    registerIframe(loadIframe) {
        if(this.isReady){
            loadIframe()
        }else {
            this.toCall.push(loadIframe)
        }

        if(!this.apiCalled){
            this._getApi()
        }
    }

    _getApi() {
        this.apiCalled = true
        let tag = document.getElementById('youtube')
        if(tag !== null) {
            this.isReady = true
            this._loadIframes()
            return
        }

        tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        tag.id = "youtube";
        const root = document.getElementById('root')
        root.parentNode.insertBefore(tag, root.nextSibling)

        window.onYouTubeIframeAPIReady = () => {
            this.isReady = true
            this._loadIframes()
        }
    }

    _loadIframes() {
        this.toCall.map(func => {func()})
        this.toCall = []
    }
}