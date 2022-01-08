import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox( { active, cases, green, title, total, ...props}) {
    return (
        <Card 
           onClick={props.onClick} 
           className={`infoBox ${active && 'infoBox_selected'} ${green && 'infoBox_green'}`}
        >
            <CardContent >
                <Typography className="infoBox_title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infoBox_cases ${green && 'infoBox_green'}`}>{cases}</h2>

                <Typography className="infoBox_total" color="textSecondary">
                    All time : {total} 
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;