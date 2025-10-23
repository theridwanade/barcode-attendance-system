export interface PassEventTicketType {
    id: `${string}.${string}`;
    issuerName?: string;
    reviewStatus?: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    eventName?: TranslatedString;
    title?: TranslatedString;
    subtitle?: TranslatedString;
    venue?: {
        name?: TranslatedString;
        address?: TranslatedString;
    };
    dateTime?: {
        start?: string; // RFC3339 (e.g. "2025-12-01T18:00:00Z")
        end?: string;
    };
    multipleDevicesAndHoldersAllowedStatus?: "MULTIPLE_HOLDERS" | "ONE_USER_ALL_DEVICES" | "ONE_USER_ONE_DEVICE";
}

interface TranslatedString {
    defaultValue: {
        language: string;
        value: string;
    };
    translatedValues?: Array<{ language: string; value: string }>;
}