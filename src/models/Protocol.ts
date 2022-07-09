export namespace Protocol {
  // export interface initializeRespons
  export interface Viewport {
    width: number
    height: number
    isMobile?: boolean
    deviceScaleFactor?: number
    isLandscape?: boolean
    hasTouch?: boolean
  }
}

export namespace ProtocolMapping {
  export interface Events {}
  export interface Commands {
    initialize: {
      paramsType: []
      returnType: {
        id: string
      }
    }
    close: {
      paramsType: [
        {
          id: string
        }
      ]
      returnType: void
    }
    navigate: {
      paramsType: [
        {
          id: string
          url: string
        }
      ]
      returnType: void
    }
    back: {
      paramsType: [
        {
          id: string
        }
      ]
      returnType: void
    }
    forward: {
      paramsType: [
        {
          id: string
        }
      ]
      returnType: void
    }
    reload: {
      paramsType: [
        {
          id: string
        }
      ]
      returnType: void
    }
    setViewport: {
      paramsType: [
        {
          id: string
        } & Protocol.Viewport
      ]
      returnType: boolean
    }
  }
}
