
/** Represents an individual HATEOAS link */
export interface HATEOASLink {
    /** Optional title for the link */
    title?: string;
    /** The relationship of the link to the current resource */
    rel: string;
    /** The target URI of the link */
    href: string;
    /** The HTTP method used for the link */
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

}

/** Represents a collection of HATEOAS links */
export interface HATEOASLinks {
    /** A self-referencing link to the current resource */
    self: HATEOASLink;
    /** Link to the first page of a paginated resource */
    first?: HATEOASLink;
    /** Link to the previous page of a paginated resource */
    prev?: HATEOASLink;
    /** Link to the next page of a paginated resource */
    next?: HATEOASLink;
    /** Link to the last page of a paginated resource */
    last?: HATEOASLink;
    /** Additional custom links (e.g., deposits, withdrawals, etc.) */
    [key: string]: HATEOASLink | undefined;
}

/**
 * Configuration options for HATEOAS middleware
 */
export interface HATEOASOptions {
    /** Whether to automatically include all routes from the same file */
    autoIncludeSameRoute: boolean;
    /** Base URL for generating links */
    baseUrl?: string;
    /** Whether to include pagination links */
    includePagination?: boolean;
    /** Custom link generators */
    customLinks?: {
        [key: string]: (req: Request) => HATEOASLink | undefined;
    };
}

