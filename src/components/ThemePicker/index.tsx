import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';

import { ThemeContext } from '../../providers/ThemeProvider';

interface ThemePickerProps {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exampleWrapper: {
      height: 380,
      margin: theme.spacing(2),
      position: 'fixed',
      bottom: 15,
      right: 23,
    },
    icon: {
      backgroundColor: theme.palette.secondary.main,
    },
    speedDial: {
      position: 'absolute',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
  }),
);

const themeSheet: {
  [key: string]: {
    primaryColor: string;
    secondaryColor: string;
  }
} = {
  blue: {
    primaryColor: '#1976d2',
    secondaryColor: '#DC004E',
  },
  purple: {
    primaryColor: '#8e24aa',
    secondaryColor: '#3d5afe',
  },
  green: {
    primaryColor: '#43a047',
    secondaryColor: '#651fff',
  },
  red: {
    primaryColor: '#e53935',
    secondaryColor: '#3d5afe',
  },
}

const actions = [
  { icon: <FormatColorFillIcon htmlColor="#1976D2" />, name: 'Blue' },
  { icon: <FormatColorFillIcon htmlColor="#8e24aa" />, name: 'Purple' },
  { icon: <FormatColorFillIcon htmlColor="#43a047" />, name: 'Green' },
  { icon: <FormatColorFillIcon htmlColor="#e53935" />, name: 'Red' },
];

const ThemePicker: React.FC<ThemePickerProps> = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const themeVal = React.useContext(ThemeContext);
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpen = () => {
    setOpen(true);
  };

  const changeTheme = (color: string) => {
    const selectedColor = themeSheet[color.toLowerCase()];
    themeVal.setPrimaryColor(selectedColor.primaryColor);
    themeVal.setSecondaryColor(selectedColor.secondaryColor);
    handleClose();
  }

  return (
    <div className={classes.exampleWrapper}>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<ColorLensIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        color="red"
        direction="up"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => changeTheme(action.name)}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default ThemePicker;
