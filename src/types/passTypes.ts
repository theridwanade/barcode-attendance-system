/**
 * Google Wallet Event Ticket Class Schema (TypeScript)
 * Defines the template or "class" of your event ticket.
 */
export interface PassClassEventTicketType {
    /** Unique identifier for this class (issuerId.identifier) */
    id: `${string}.${string}`;

    /** The name of your business or issuing entity */
    issuerName?: string;

    /** Google review status (UNDER_REVIEW during testing) */
    reviewStatus?: "UNDER_REVIEW" | "APPROVED" | "REJECTED";

    /** The name of the event (displayed prominently in Wallet) */
    eventName: TranslatedString;

    /** Optional secondary titles or subtitles */
    title?: TranslatedString;
    subtitle?: TranslatedString;

    /** Venue details: name + address or Google Place ID */
    venue?: {
        name?: TranslatedString;
        address?: TranslatedString;
        placeId?: string;
    };

    /** Event start/end times (ISO 8601 / RFC3339) */
    dateTime?: {
        start?: string;
        end?: string;
    };

    /** Optional branding and presentation options */
    logo?: Image;
    heroImage?: Image;
    hexBackgroundColor?: string;

    /** Allow multiple device holders (default: ONE_USER_ALL_DEVICES) */
    multipleDevicesAndHoldersAllowedStatus?:
    | "MULTIPLE_HOLDERS"
    | "ONE_USER_ALL_DEVICES"
    | "ONE_USER_ONE_DEVICE";
}

/**
 * Google Wallet Event Ticket Object Schema (TypeScript)
 * Defines an actual user's ticket instance.
 */
export interface PassObjectEventTicketType {
    /** Unique identifier for this object (issuerId.identifier) */
    id: `${string}.${string}`;

    /** Reference to its class (must exist first) */
    classId: `${string}.${string}`;

    /** Current pass state */
    state?: "ACTIVE" | "EXPIRED" | "COMPLETED" | "CANCELED";

    /** Visual barcode or QR code */
    barcode?: Barcode;

    /** Optional top-level card title */
    cardTitle?: TranslatedString;

    /** Seat or admission details */
    seatInfo?: {
        seat?: TranslatedString;
        row?: TranslatedString;
        section?: TranslatedString;
        gate?: TranslatedString;
    };

    /** Name printed on the ticket */
    ticketHolderName?: string;

    /** Ticket or order number */
    ticketNumber?: string;

    /** Optional: custom texts or links */
    textModulesData?: Array<{
        header?: string;
        body?: string;
    }>;
    linksModuleData?: {
        uris: Array<{
            uri: string;
            description: string;
        }>;
    };

    /** Branding overrides */
    heroImage?: Image;
    logo?: Image;
    hexBackgroundColor?: string;
}

/** Shared TranslatedString type used across all fields */
export interface TranslatedString {
    defaultValue: {
        language: string; // e.g. "en-US"
        value: string;
    };
    translatedValues?: Array<{ language: string; value: string }>;
}

/** Image descriptor used by logo, heroImage, etc. */
export interface Image {
    sourceUri: {
        uri: string;
        description?: string;
    };
    contentDescription?: TranslatedString;
}

/** Barcode format supported by Google Wallet */
export interface Barcode {
    type: "QR_CODE" | "PDF417" | "AZTEC" | "CODE128";
    value: string;
    alternateText?: string;
}
