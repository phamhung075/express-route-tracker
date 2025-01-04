
/** Represents an individual HATEOAS link */
export interface HATEOASLink {
    /** Optional title for the link */
    title?: string;
    /** The relationship of the link to the current resource */
    rel: string;
    /** The target URI of the link */
    href: string;
    /** The HTTP method used for the link */
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

}

/** Represents a collection of HATEOAS links */
export interface HATEOASLinks {
    [key: string]: HATEOASLink;
}

/**
 * Configuration options for HATEOAS middleware
 */
export interface HATEOASOptions {
    autoIncludeSameRoute?: boolean;
    baseUrl?: string;
    includePagination?: boolean;
    customLinks?: {
        [key: string]: (req: Request) => HATEOASLink;
    };
}
