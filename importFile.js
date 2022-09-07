const CloudConvert = require('cloudconvert');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const cloudConvert = new CloudConvert(apiKey);

module.exports = {
    convertFile: async function(url){
        let job = await cloudConvert.jobs.create({
            tasks: {
                'import-my-file': {
                    operation: "import/url",
                    url
                },
                'convert-my-file': {
                    operation: 'convert',
                    input: 'import-my-file',
                    output_format: 'mp3',
                },
                'export-my-file': {
                    operation: 'export/url',
                    input: 'convert-my-file'
                }
            }
        })

        job = await cloudConvert.jobs.wait(job.id);

        const exportTask = job.tasks.filter(
            task => task.operation === "export/url" && task.status === "finished"
        )[0];
        const file = exportTask.result.files[0];

        return file.url;
    },
}