export declare const ExportFormat: {
    readonly pdfType: "pdfType";
    readonly epubType: "epubType";
    readonly htmlType: "htmlType";
    readonly jpgType: "jpgType";
    readonly pngType: "pngType";
    readonly gifType: "gifType";
    readonly swfType: "swfType";
    readonly xmlType: "xmlType";
    readonly packageType: "packageType";
};
export type ExportFormat = (typeof ExportFormat)[keyof typeof ExportFormat];
export declare const LocationOptions: {
    readonly before: "before";
    readonly after: "after";
    readonly atBeginning: "atBeginning";
    readonly atEnd: "atEnd";
    readonly unknown: "unknown";
};
export type LocationOptions = (typeof LocationOptions)[keyof typeof LocationOptions];
export declare const SaveOptions: {
    readonly yes: "yes";
    readonly no: "no";
    readonly ask: "ask";
};
export type SaveOptions = (typeof SaveOptions)[keyof typeof SaveOptions];
export declare const Units: {
    readonly points: "points";
    readonly picas: "picas";
    readonly inches: "inches";
    readonly millimeters: "millimeters";
    readonly centimeters: "centimeters";
    readonly ciceros: "ciceros";
    readonly pixels: "pixels";
};
export type Units = (typeof Units)[keyof typeof Units];
export declare const PageOrientation: {
    readonly portrait: "portrait";
    readonly landscape: "landscape";
    readonly reversePortrait: "reversePortrait";
    readonly reverseLandscape: "reverseLandscape";
};
export type PageOrientation = (typeof PageOrientation)[keyof typeof PageOrientation];
export declare const Alignment: {
    readonly leftAlign: "leftAlign";
    readonly centerAlign: "centerAlign";
    readonly rightAlign: "rightAlign";
    readonly justifyAlign: "justifyAlign";
};
export type Alignment = (typeof Alignment)[keyof typeof Alignment];
export declare const LayerProperties: {
    readonly visible: "visible";
    readonly locked: "locked";
    readonly printable: "printable";
    readonly guideLayer: "guideLayer";
};
export type LayerProperties = (typeof LayerProperties)[keyof typeof LayerProperties];
export declare const EffectTypes: {
    readonly dropShadow: "dropShadow";
    readonly innerShadow: "innerShadow";
    readonly outerGlow: "outerGlow";
    readonly innerGlow: "innerGlow";
    readonly bevelEmboss: "bevelEmboss";
    readonly satin: "satin";
    readonly basicFeather: "basicFeather";
    readonly directionalFeather: "directionalFeather";
    readonly gradientFeather: "gradientFeather";
};
export type EffectTypes = (typeof EffectTypes)[keyof typeof EffectTypes];
//# sourceMappingURL=enums.d.ts.map