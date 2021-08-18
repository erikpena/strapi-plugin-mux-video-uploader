declare module '@buffetjs/core';

type InputTextOnChange = { target: { value: string } };
type InputFileOnChange = { target: { files: File[] } };
type ToggleOnChange = { target: { value: boolean } };
