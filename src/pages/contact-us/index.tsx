import Box from '@mui/material/Box';

import ContactCard from './ContactCard';

import headerBackground from 'assets/images/landing/bg-header.jpg';


export default function ContactUsPage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: '100% 600px',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        textAlign: 'center'
      }}
    >
      <ContactCard />
    </Box>
  );
}
