// // import { saveAs } from 'file-saver';
// import save from 'save-file'
// import { Tester, ITestArguments } from 'vvo-testcases';
// import { ITrip } from 'dvbjs';

// function getFilename(trip:ITrip):string {
//     const timeStamp = trip.departure ? trip.departure.time : new Date()
//     const timeStampString = timeStamp.toISOString()
//         .replace(/T/, '-')      // replace T with a -
//         .replace(/\..+/, '')     // delete the dot and everything after
//     const from = trip.departure ? `${trip.departure!.city}${trip.departure!.name}` : "Unknown Stop"
//     const to = trip.arrival ? `${trip.arrival!.city}${trip.arrival!.name}` : "Unknown Stop"

//     return timeStampString + "_" + from + "_" + to + ".xlsx"

// }

// export function savetoFile(testCase: ITestArguments){
//     const fileName = getFilename(testCase.trip)
//     const tester = new Tester()
//     tester.exportSingleTestCase(testCase)
//     .then(async (buffer) =>  {
//         await save(buffer, fileName)
//     })
// }

export {};
