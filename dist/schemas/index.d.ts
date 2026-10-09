import { z } from 'zod';
export declare const createDocumentSchema: z.ZodObject<{
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
    pages: z.ZodDefault<z.ZodNumber>;
    margins: z.ZodDefault<z.ZodObject<{
        top: z.ZodDefault<z.ZodNumber>;
        bottom: z.ZodDefault<z.ZodNumber>;
        left: z.ZodDefault<z.ZodNumber>;
        right: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    }>>;
    bleed: z.ZodOptional<z.ZodObject<{
        top: z.ZodDefault<z.ZodNumber>;
        bottom: z.ZodDefault<z.ZodNumber>;
        left: z.ZodDefault<z.ZodNumber>;
        right: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    }>>;
    slug: z.ZodOptional<z.ZodObject<{
        top: z.ZodDefault<z.ZodNumber>;
        bottom: z.ZodDefault<z.ZodNumber>;
        left: z.ZodDefault<z.ZodNumber>;
        right: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }, {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    }>>;
    facingPages: z.ZodDefault<z.ZodBoolean>;
    orientation: z.ZodDefault<z.ZodEnum<["portrait", "landscape"]>>;
}, "strip", z.ZodTypeAny, {
    width: number;
    height: number;
    pages: number;
    margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    facingPages: boolean;
    orientation: "portrait" | "landscape";
    bleed?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    } | undefined;
    slug?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    } | undefined;
}, {
    width?: number | undefined;
    height?: number | undefined;
    pages?: number | undefined;
    margins?: {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    bleed?: {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    slug?: {
        top?: number | undefined;
        bottom?: number | undefined;
        left?: number | undefined;
        right?: number | undefined;
    } | undefined;
    facingPages?: boolean | undefined;
    orientation?: "portrait" | "landscape" | undefined;
}>;
export declare const pageSchema: z.ZodObject<{
    index: z.ZodNumber;
    properties: z.ZodOptional<z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        pageColor: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        label?: string | undefined;
        pageColor?: string | undefined;
    }, {
        label?: string | undefined;
        pageColor?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    index: number;
    properties?: {
        label?: string | undefined;
        pageColor?: string | undefined;
    } | undefined;
}, {
    index: number;
    properties?: {
        label?: string | undefined;
        pageColor?: string | undefined;
    } | undefined;
}>;
export declare const addPageSchema: z.ZodObject<{
    position: z.ZodDefault<z.ZodEnum<["atEnd", "atBeginning", "before", "after"]>>;
    referencePage: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    position: "before" | "after" | "atBeginning" | "atEnd";
    referencePage?: number | undefined;
}, {
    position?: "before" | "after" | "atBeginning" | "atEnd" | undefined;
    referencePage?: number | undefined;
}>;
export declare const openDocumentSchema: z.ZodObject<{
    filePath: z.ZodString;
    showWindow: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    showWindow: boolean;
}, {
    filePath: string;
    showWindow?: boolean | undefined;
}>;
export declare const saveDocumentSchema: z.ZodObject<{
    filePath: z.ZodOptional<z.ZodString>;
    saveOptions: z.ZodDefault<z.ZodEnum<["yes", "no", "ask"]>>;
}, "strip", z.ZodTypeAny, {
    saveOptions: "yes" | "no" | "ask";
    filePath?: string | undefined;
}, {
    filePath?: string | undefined;
    saveOptions?: "yes" | "no" | "ask" | undefined;
}>;
export declare const closeDocumentSchema: z.ZodObject<{
    saveOptions: z.ZodDefault<z.ZodEnum<["yes", "no", "ask"]>>;
}, "strip", z.ZodTypeAny, {
    saveOptions: "yes" | "no" | "ask";
}, {
    saveOptions?: "yes" | "no" | "ask" | undefined;
}>;
export declare const placeFileSchema: z.ZodObject<{
    filePath: z.ZodString;
    pageIndex: z.ZodNumber;
    x: z.ZodNumber;
    y: z.ZodNumber;
    layerIndex: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    pageIndex: number;
    x: number;
    y: number;
    layerIndex?: number | undefined;
}, {
    filePath: string;
    pageIndex: number;
    x: number;
    y: number;
    layerIndex?: number | undefined;
}>;
export declare const exportDocumentSchema: z.ZodObject<{
    format: z.ZodEnum<["pdf", "epub", "html", "jpg", "png", "package"]>;
    filePath: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    format: "pdf" | "epub" | "html" | "jpg" | "png" | "package";
    options?: Record<string, unknown> | undefined;
    filePath?: string | undefined;
}, {
    format: "pdf" | "epub" | "html" | "jpg" | "png" | "package";
    options?: Record<string, unknown> | undefined;
    filePath?: string | undefined;
}>;
export declare const executeCodeSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
export declare const preflightSchema: z.ZodObject<{
    profile: z.ZodOptional<z.ZodString>;
    waitForCompletion: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    waitForCompletion: boolean;
    profile?: string | undefined;
}, {
    profile?: string | undefined;
    waitForCompletion?: boolean | undefined;
}>;
//# sourceMappingURL=index.d.ts.map