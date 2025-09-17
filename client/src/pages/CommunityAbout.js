import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  Telegram,
  Instagram,
  CheckCircle,
  Warning,
  CardGiftcard,
  Link as LinkIcon
} from '@mui/icons-material';

const CommunityAbout = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        py: 2,
        px: 3
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Cryptomanji
            </Typography>
            <Button variant="outlined" color="primary">
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Community Identity */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
            Cryptomanji
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Chip label="Private" color="secondary" size="small" />
            <Chip label="941 members" color="primary" size="small" />
            <Chip label="Paid" color="success" size="small" />
          </Box>
        </Box>

        {/* Hero Section */}
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
              🚀 Bienvenido a Cryptomanji
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#666', mb: 3 }}>
              La comunidad hispana que está dejando de correr en carreras saturadas…<br/>
              Y empieza a prosperar con habilidades del futuro.
            </Typography>
            
            {/* Value Proposition */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Lo que desbloqueas por solo $27/mes (valorado en más de $2,000) ⬇️
              </Typography>
            </Box>

            {/* Features List */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Cursos premium de Web3, Blockchain, DAOs, Legal Tech, AI, RWA y más
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Certificación on-chain para validar tus conocimientos en la industria
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Clases en vivo con expertos y moderadores activos en el mundo cripto
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Reporterías semanales: análisis, tendencias y oportunidades Web3 en tiempo real
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Comunidad activa en Skool y Telegram para colaborar, preguntar y crecer
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Acceso inmediato a herramientas, infografías y recursos aplicables desde el día 1
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Roadmap estructurado para que vayas de cero a ofrecer tus servicios en el ecosistema Web3
                </Typography>
              </Box>
            </Box>

            {/* Additional Info */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <Warning sx={{ color: '#ff9800', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Todos los cursos son flexibles, grabados y sin relleno
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <CardGiftcard sx={{ color: '#e91e63', mr: 2, mt: 0.5 }} />
                <Typography variant="body1">
                  Bonus: Trade Ideas semanales y ejemplos reales
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2 }}>
                Todo esto, por solo $27 al mes.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Warning sx={{ color: '#f44336', mr: 1, mt: 0.5 }} />
                <Typography variant="body1" sx={{ color: '#f44336' }}>
                  El precio aumenta a $47 al mes con 1000 miembros.
                </Typography>
              </Box>
            </Box>

            {/* Community Description */}
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <LinkIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                  Certificación, comunidad y visión de futuro.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            Privacy and terms
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Cryptomanji
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            skool.com/cryptomanji
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 3, maxWidth: '600px', mx: 'auto' }}>
            Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <IconButton color="primary">
              <Instagram />
            </IconButton>
            <IconButton color="primary">
              <Telegram />
            </IconButton>
          </Box>

          {/* Community Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              941 Members
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              0 Online
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              5 Admins
            </Typography>
          </Box>

          {/* Join Button */}
          <Button 
            variant="contained" 
            size="large" 
            sx={{ 
              backgroundColor: '#1976d2',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            JOIN GROUP
          </Button>
        </Box>

        {/* Powered By */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Powered by
          </Typography>
          <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            Skool
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CommunityAbout;
