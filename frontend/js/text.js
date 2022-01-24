noteField.addEventListener('keydown', (e) => 
{
    console.log(e.key);
    if(!canInteract)
    {
        if(e.key !== 'Tab') e.preventDefault();
        return;
    }

    if(e.key === 'Enter')
    {
        //List

        let textSplit = noteField.value.split('\n');
        let lastLine = textSplit[textSplit.length - 1];

        if(lastLine.startsWith('- ')) addToField('\n- ');
        else if(lastLine.startsWith('-')) addToField('\n-');
        else if(lastLine.startsWith('* ')) addToField('\n* ');
        else if(lastLine.startsWith('*')) addToField('\n*');
        else if(!isNaN(parseInt(lastLine[0])))
        {
            //Si el primer caractér de la línea es un número.
            let n = getTheNumber();
            if(lastLine.startsWith(`${n}- `)) addToField(`\n${++n}- `);
            else if(lastLine.startsWith(`${n}-`)) addToField(`\n${++n}-`);
            else if(lastLine.startsWith(`${n} - `)) addToField(`\n${++n} - `);
            else if(lastLine.startsWith(`${n} -`)) addToField(`\n${++n} -`);
            else if(lastLine.startsWith(`${n}. `)) addToField(`\n${++n}. `);
            else if(lastLine.startsWith(`${n}.`)) addToField(`\n${++n}.`);
            else if(lastLine.startsWith(`${n}) `)) addToField(`\n${++n}) `);
            else if(lastLine.startsWith(`${n})`)) addToField(`\n${++n})`);
            else if(lastLine.startsWith(`${n} ) `)) addToField(`\n${++n} ) `);
            else if(lastLine.startsWith(`${n} )`)) addToField(`\n${++n} )`);
        }

        function getTheNumber()
        {
            let lastNum = '';
            for(let i = 0; i < lastLine.length; i++)
            {
                if(!isNaN(parseInt(lastLine[i])))
                {
                    lastNum += lastLine[i];
                }
                else break;
            }

            return parseInt(lastNum);
        }

        function addToField(toAdd)
        {
            e.preventDefault();
            noteField.value += toAdd;
            noteField.scrollTop = noteField.scrollHeight;
        }
    }
});