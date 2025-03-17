import React, { ChangeEvent, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { toast } from 'sonner'


type Props = {
    onReportConfirmation: (data: string) => void
}
const ReportComponent = ({ onReportConfirmation }: Props) => {

    const [base64Data, setBase64Data] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState("");
    function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {


        if (!event.target.files) return;


        const file = event.target.files[0];


        if (file) {
            let isValidDoc = false;
            const validDocs = ['application/pdf'];
            if (validDocs.includes(file.type)) {
                isValidDoc = true;
            }
            if (!isValidDoc) {
                toast.warning("Filetype not supproted!");
                return;
            }

            if (isValidDoc) {
                const reader = new FileReader();
                
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setBase64Data(base64String);
                    console.log(base64String);
                };

                reader.readAsDataURL(file);
            }
        }
    }

    return (
        <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
            <fieldset className='relative grid gap-6 rounded-lg border p-4'>
                <legend className="text-sm font-medium">Report</legend>
                {isLoading && (
                    <div
                        className={"absolute z-10 h-full w-full bg-card/90 rounded-lg flex flex-row items-center justify-center"
                        }
                    >
                        extracting...
                    </div>
                )}
                <Input type='file'
                    onChange={handleReportSelection} />
                <Label>Report Summary</Label>
                <Textarea
                    value={reportData}
                    onChange={(e) => {
                        setReportData(e.target.value);
                    }}
                    placeholder="Extracted data from the pdf will appear here."
                    className="min-h-72 resize-none border-0 p-3 shadow-none focus-visible:ring-0" />
                <Button
                    variant="destructive"
                    className="bg-[#D90013]"
                    onClick={() => {
                        onReportConfirmation(reportData);
                    }}
                >
                    2. Looks Good
                </Button>
            </fieldset>
        </div>
    )
}

export default ReportComponent