import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import SaveOutlined from '@mui/icons-material/SaveOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { iconButtonBlueSx, iconButtonGreenSx, iconButtonRedSx } from 'styles';

interface InlineEditActionsProps {
  editing: boolean;
  saving: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function InlineEditActions({ editing, saving, disabled = false, onEdit, onSave, onCancel }: InlineEditActionsProps) {
  
  if (editing) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Save changes">
          <span>
            <IconButton size="small" onClick={onSave} disabled={saving} sx={iconButtonGreenSx}>
              {saving ? <CircularProgress size={12} /> : <SaveOutlined sx={{ fontSize: 15 }} />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Cancel">
          <IconButton size="small" onClick={onCancel} sx={iconButtonRedSx}>
            <CloseOutlined sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Tooltip title="Edit value">
      <IconButton size="small" onClick={onEdit} disabled={disabled} sx={iconButtonBlueSx}>
        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
      </IconButton>
    </Tooltip>
  );
}
