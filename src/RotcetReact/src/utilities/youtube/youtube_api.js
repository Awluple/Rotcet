import 'regenerator-runtime/runtime'

export default class YoutubeApi {
    // downloads YouTube api and oversees iframe loading
    constructor() {
        this.api_called = false
        this.is_ready = false
        this.to_call = []
    }
    registerIframe(loadIframe) {
        if(this.is_ready){
            loadIframe()
        }else {
            this.to_call.push(loadIframe)
        }

        if(!this.api_called){
            this._getApi()
        }
    }

    _getApi() {
        this.api_called = true
        let tag = document.getElementById('youtube')
        if(tag !== null) {
            this.is_ready = true
            this._loadIframes()
            return
        }

        tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        tag.id = "youtube";
        const root = document.getElementById('root')
        root.parentNode.insertBefore(tag, root.nextSibling)

        window.onYouTubeIframeAPIReady = () => {
            this.is_ready = true
            this._loadIframes()
        }
    }

    _loadIframes() {
        this.to_call.map(func => {func()})
    }
}