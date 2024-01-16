import { Page, Locator } from "@playwright/test";

export default class PlaywrightWrapper {

    constructor(private page: Page) { }

    /**
     * Navigates to the specified URL.
     * @param {string} url - The URL to navigate to.
     */
    async goto(url: string) {
        await this.page.goto(url, {
            waitUntil: "domcontentloaded"
        });
    }

    /**
     * Waits for the element to be visible and clicks it.
     * @param {string} locator - The locator strategy for the element.
     */
    async waitAndClick(locator: string) {
        const element = this.page.locator(locator);
        await element.waitFor({
            state: "visible"
        });
        await element.click();
    }

    /**
     * Navigates to the specified link and waits for the page to load.
     * @param {string} link - The link to navigate to.
     */
    async navigateTo(link: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(link)
        ]);
    }

    /**
     * Enters the given value into the specified input field.
     * @param {string} locator - The locator strategy for the input field.
     * @param {string} value - The value to enter.
     */
    async enterValue(locator: string, value: string) {
        const element = this.page.locator(locator);
        await element.type(value);
    }

    /**
     * Selects an option from the dropdown by its visible text.
     * @param {string} locator - The locator strategy for the dropdown.
     * @param {string} optionText - The visible text of the option to select.
     */
    async selectDropdown(locator: string, optionText: string) {
        const dropdown = this.page.locator(locator);
        await dropdown.selectOption({ label: optionText });
    }

    /**
     * Hovers over the specified element.
     * @param {string} locator - The locator strategy for the element to hover over.
     */
    async hover(locator: string) {
        const element = this.page.locator(locator);
        await element.hover();
    }

    /**
     * Highlights the specified element.
     * @param {string} locator - The locator strategy for the element to highlight.
     */
    async highlightElement(locator: string) {
        const element = this.page.locator(locator);
        await this.page.evaluate((el) => {
            el.highlight();
        }, element);
    }

    /**
     * Performs a double click on the specified element.
     * @param {string} locator - The locator strategy for the element to double click.
     */
    async doubleClick(locator: string) {
        const element = this.page.locator(locator);
        await element.dblclick();
    }

    /**
     * Moves the mouse to the specified element.
     * @param {string} locator - The locator strategy for the element to move to.
     */
    async moveToElement(locator: string) {
        const element = this.page.locator(locator);
        await element.hover();
    }

    /**
     * Verifies if the specified element is available on the page.
     * @param {string} locator - The locator strategy for the element to verify.
     * @returns {boolean} - True if the element is available, false otherwise.
     */
    async isElementAvailable(locator: string): Promise<boolean> {
        const element = this.page.locator(locator);
        return await element.isVisible();
    }

    /**
     * Uploads a file using the specified input field.
     * @param {string} locator - The locator strategy for the file input field.
     * @param {string} filePath - The path to the file to be uploaded.
     */
    async uploadFile(locator: string, filePath: string) {
        const element = this.page.locator(locator);
        await element.setInputFiles(filePath);
    }

    /**
     * Selects an option from the auto-suggestion dropdown.
     * @param {string} locator - The locator strategy for the auto-suggestion input field.
     * @param {string} suggestionText - The text of the suggestion to select.
     */
    async selectAutoSuggestion(locator: string, suggestionText: string) {
        const element = this.page.locator(locator);
        await element.type(suggestionText);
        await this.page.waitForSelector(`text=${suggestionText}`);
        await element.press('Enter');
    }

    /**
     * Gets the text content of the specified element.
     * @param {string} locator - The locator strategy for the element.
     * @returns {string} - The text content of the element.
     */
    async getText(locator: string): Promise<string> {
        const element = this.page.locator(locator);
        return await element.textContent();
    }

    /**
     * Compares the text content of two elements.
     * @param {string} locator1 - The locator strategy for the first element.
     * @param {string} locator2 - The locator strategy for the second element.
     * @returns {boolean} - True if the text content of the elements is the same, false otherwise.
     */
    async compareText(locator1: string, locator2: string): Promise<boolean> {
        const text1 = await this.getText(locator1);
        const text2 = await this.getText(locator2);
        return text1 === text2;
    }

    /**
     * Gets the current date in the specified format.
     * @param {string} format - The format in which the date should be returned (e.g., "MM/DD/YYYY").
     * @returns {string} - The current date formatted as per the specified format.
     */
    getCurrentDate(format: string): string {
        const currentDate = new Date();
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(currentDate);
    }

    /**
     * Gets the current time in the specified format.
     * @param {string} format - The format in which the time should be returned (e.g., "HH:mm:ss").
     * @returns {string} - The current time formatted as per the specified format.
     */
    getCurrentTime(format: string): string {
        const currentDate = new Date();
        return new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(currentDate);
    }

    /**
     * Accepts an alert dialog.
     */
    async acceptAlert() {
        await this.page.waitForTimeout(500); // Give some time for the alert to appear, if any.
        const alert = this.page.locator('text=OK');
        if (await alert.isVisible()) {
            await alert.click();
        } else {
            await this.page.keyboard.press('Enter');
        }
    }

    /**
     * Dismisses an alert dialog.
     */
    async dismissAlert() {
        await this.page.waitForTimeout(500); // Give some time for the alert to appear, if any.
        const alert = this.page.locator('text=Cancel');
        if (await alert.isVisible()) {
            await alert.click();
        } else {
            await this.page.keyboard.press('Escape');
        }
    }

    /**
     * Gets the text content of an alert dialog and accepts it.
     * @returns {string} - The text content of the alert dialog.
     */
    async getTextAndAcceptAlert(): Promise<string> {
        let alertText = '';

        // Set up an event listener for the 'dialog' event
        this.page.on('dialog', async (dialog) => {
            alertText = dialog.message();
            await dialog.accept();
        });
        return alertText;
    }



    /**
     * Generates a random value based on the specified parameters.
     * @param {number} length - The length of the random value.
     * @param {string} type - The type of the random value (e.g., "numeric", "alphanumeric", "characters").
     * @returns {string} - The generated random value.
     */
    generateRandomValue(length: number, type: string): string {
        const getRandomChar = (characters: string) => {
            const randomIndex = Math.floor(Math.random() * characters.length);
            return characters.charAt(randomIndex);
        };

        let characters = '';
        if (type === 'numeric') {
            characters = '0123456789';
        } else if (type === 'alphanumeric') {
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        } else if (type === 'characters') {
            characters = '!@#$%^&*()_-+=<>?';
        }

        let randomValue = '';
        for (let i = 0; i < length; i++) {
            randomValue += getRandomChar(characters);
        }

        return randomValue;
    }

    /**
     * Changes the format of the given date.
     * @param {string} inputDate - The input date string.
     * @param {string} inputFormat - The format of the input date (e.g., "YYYY-MM-DD").
     * @param {string} outputFormat - The desired format for the output date (e.g., "MM/DD/YYYY").
     * @returns {string} - The date string formatted as per the output format.
     */
    changeDateFormat(inputDate: string, inputFormat: string, outputFormat: string): string {
        const date = new Date(inputDate);

        // Define options separately
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

        // Use options when creating Intl.DateTimeFormat instance
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedDate = formatter.format(date);

        return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3'); // Swap day and month
    }

    /**
     * Converts the given string to a money format.
     * @param {string} amount - The string representing the amount.
     * @returns {string} - The amount formatted as money (e.g., "1,000.00").
     */
    convertToMoneyFormat(amount: string): string {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) {
            throw new Error('Invalid amount');
        }
        return parsedAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }




}
