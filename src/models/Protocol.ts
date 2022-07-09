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
        frameId: string
      }
    }
    close: {
      paramsType: [
        {
          frameId: string
        }
      ]
      returnType: void
    }
    setViewport: {
      paramsType: [
        {
          frameId: string
        } & Protocol.Viewport
      ]
      returnType: boolean
    }
  }
}
