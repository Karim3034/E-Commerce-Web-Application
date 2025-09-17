import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidator {
    static notOnlyWhiteSpaces(control: FormControl): ValidationErrors | null {

        if (control.value != null && control.value.trim().length === 0) {
            return { 'notonlywhitespaces': true };
        }
        else {
            return null;
        }
    }
}
