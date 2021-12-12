const topBar = document.getElementById('topBar');
const textArea = document.getElementById('noteField');

const leftBar = document.getElementById('leftBar');


window.onresize = resizeElements;

resizeElements();

function resizeElements()
{
    resizeTextArea();
    hideLeftBar();

    setTimeout(resizeElements, 50);

    function resizeTextArea()
    {
        textArea.style.width = topBar.offsetWidth;
    }

    function hideLeftBar()
    {
        const n = 700;
        if(leftBar.hidden)
        {
            if(window.innerWidth > n) leftBar.hidden = false;
        }
        else
        {
            if(window.innerWidth <= n) leftBar.hidden = true;
        }
        
    }
}
