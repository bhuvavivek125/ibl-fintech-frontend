import CalendarTodayTwoTone from '@mui/icons-material/CalendarTodayTwoTone';

export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slots: { openPickerIcon: () => <CalendarTodayTwoTone /> }
      }
    }
  };
}
