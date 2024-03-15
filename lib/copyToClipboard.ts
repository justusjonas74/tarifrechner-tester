function fallbackCopyTextToClipboard(text:string,onError?:(err:any)=>void, onSuccess?:(text:string)=>void) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        if (onSuccess) {onSuccess('Fallback: Copying text command was ' + msg)} else {
            console.log('Fallback: Copying text command was ' + msg);
        }
    } catch (err) {
        if (onError) {onError(err)} else {
            console.error('Fallback: Oops, unable to copy', err);
        }
    }

    document.body.removeChild(textArea);
}
export default function copyTextToClipboard(text:string, onError?:(err:any)=>void, onSuccess?:(text:string)=>void) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, onError, onSuccess);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        if(onSuccess) {onSuccess('Async: Copying to clipboard was successful!')} else {
            console.log('Async: Copying to clipboard was successful!');
        }
    }, function (err) {
        if(onError){onError(err)} else {
            console.error('Async: Could not copy text: ', err);
        }
    });
}