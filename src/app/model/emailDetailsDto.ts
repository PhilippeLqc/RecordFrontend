export interface EmailDetailsDto {
    template: string;
    to: string;
    subject: string;
    variables: { [key: string]: string };
}