import React, { useState } from 'react';
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
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import {
  Telegram,
  Instagram,
  CheckCircle,
  Warning,
  CardGiftcard,
  Link as LinkIcon,
  PlayArrow,
  People,
  Security,
  CreditCard,
  Person
} from '@mui/icons-material';

const CommunityAbout = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoThumbnails = [
    { id: 1, thumbnail: '/api/placeholder/120/80', hasPlay: true },
    { id: 2, thumbnail: '/api/placeholder/120/80', hasPlay: false },
    { id: 3, thumbnail: '/api/placeholder/120/80', hasPlay: false },
    { id: 4, thumbnail: '/api/placeholder/120/80', hasPlay: false },
    { id: 5, thumbnail: '/api/placeholder/120/80', hasPlay: false },
    { id: 6, thumbnail: '/api/placeholder/120/80', hasPlay: true },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e5e7eb',
        py: 2,
        px: 3
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                backgroundColor: 'black', 
                borderRadius: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography sx={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  ₿
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: '600', color: '#111827' }}>
                Cryptomanji
              </Typography>
              <Typography sx={{ color: '#9ca3af', fontSize: '1rem' }}>⟡</Typography>
            </Box>
            <Button 
              variant="outlined" 
              sx={{ 
                color: '#6b7280',
                borderColor: '#d1d5db',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#9ca3af'
                }
              }}
            >
              LOG IN
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Main Content Card */}
        <Card sx={{ mb: 4, boxShadow: 1, overflow: 'hidden' }}>
          <CardContent sx={{ p: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', p: 3, pb: 2 }}>
              Cryptomanji
            </Typography>
            
            <Box sx={{ px: 3, pb: 3 }}>
              {/* Video Player and Sidebar Grid */}
              <Grid container spacing={3} sx={{ mb: 2 }}>
                {/* Video Player - 4/5 of the space */}
                <Grid item xs={12} lg={8}>
                  <Box sx={{ 
                    position: 'relative',
                    backgroundColor: 'linear-gradient(90deg, #064e3b 0%, #374151 50%, #d97706 100%)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    aspectRatio: '16/9'
                  }}>
                    <Box sx={{ 
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.3)'
                    }} />
                    <Box 
                      component="img"
                      src="/api/placeholder/600/337"
                      alt="Crypto education video"
                      sx={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.7
                      }}
                    />
                    <Box sx={{ 
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconButton 
                        onClick={() => setIsPlaying(!isPlaying)}
                        sx={{ 
                          width: 64,
                          height: 64,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          '&:hover': {
                            backgroundColor: 'white'
                          }
                        }}
                      >
                        <PlayArrow sx={{ fontSize: 32, color: '#374151', ml: 0.5 }} />
                      </IconButton>
                    </Box>
                    
                    {/* Video Controls */}
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16
                    }}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'white'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label="esc" 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              fontSize: '0.75rem'
                            }} 
                          />
                          <Chip 
                            label="↻ 1.2×" 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              fontSize: '0.75rem'
                            }} 
                          />
                          <Chip 
                            label="1dd" 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              fontSize: '0.75rem'
                            }} 
                          />
                        </Box>
                      </Box>
                      <Box sx={{ mt: 1, color: 'white', fontSize: '0.875rem' }}>
                        <Typography component="span" sx={{ textDecoration: 'line-through' }}>
                          2 min 57 sec
                        </Typography>
                        <Typography component="span" sx={{ ml: 2 }}>
                          ⟡ 2 min 28 sec
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Sidebar - 1/5 of the space */}
                <Grid item xs={12} lg={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Community Card */}
                    <Paper sx={{ 
                      backgroundColor: 'black', 
                      color: 'white', 
                      p: 2,
                      borderRadius: 2
                    }}>
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 'bold', 
                          color: '#fbbf24',
                          mb: 1
                        }}>
                          Crypto Manji
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>
                            Cryptomanji
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#d1d5db' }}>
                            skool.com/cryptomanji
                          </Typography>
                        </Box>

                        <Typography variant="caption" sx={{ 
                          color: '#d1d5db',
                          lineHeight: 1.5
                        }}>
                          Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y 
                          prosperar en el emocionante mundo de inversiones en activos digitales.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d1d5db' }}>
                            <Instagram sx={{ fontSize: 12 }} />
                            <Typography variant="caption">Instagram</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d1d5db' }}>
                            <Telegram sx={{ fontSize: 12 }} />
                            <Typography variant="caption">Telegram</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Stats Card */}
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#111827' }}>
                              941
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Members
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#111827' }}>
                              0
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Online
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#111827' }}>
                              5
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Admins
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Button 
                        fullWidth
                        sx={{ 
                          backgroundColor: '#fbbf24',
                          color: 'black',
                          fontWeight: '600',
                          py: 1,
                          '&:hover': {
                            backgroundColor: '#f59e0b'
                          }
                        }}
                      >
                        JOIN GROUP
                      </Button>

                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                          Powered by <Typography component="span" sx={{ fontWeight: '600', color: '#ef4444' }}>skool</Typography>
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>

              {/* Video Thumbnails */}
              <Grid container spacing={1}>
                {videoThumbnails.map((video) => (
                  <Grid item xs={2} key={video.id}>
                    <Box sx={{ 
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.8 }
                    }}>
                      <Box sx={{ 
                        aspectRatio: '16/9',
                        backgroundColor: '#e5e7eb',
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <Box 
                          component="img"
                          src={video.thumbnail}
                          alt={`Video ${video.id}`}
                          sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {video.hasPlay && (
                          <Box sx={{ 
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Box sx={{ 
                              width: 24,
                              height: 24,
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <PlayArrow sx={{ fontSize: 12, color: '#374151', ml: 0.5 }} />
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Bottom Section: Community Info */}
        <Card sx={{ boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
                <Security sx={{ fontSize: 20 }} />
                <Typography>Private</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
                <People sx={{ fontSize: 20 }} />
                <Typography>941 members</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
                <CreditCard sx={{ fontSize: 20 }} />
                <Typography>Paid</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
                <Box sx={{ 
                  width: 24,
                  height: 24,
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    ₿
                  </Typography>
                </Box>
                <Typography>By Crypto Manji</Typography>
              </Box>
            </Box>

            {/* Welcome Message */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                <Typography component="span" sx={{ mr: 1 }}>🚀</Typography>
                Bienvenido a Cryptomanji
              </Typography>
              
              <Typography sx={{ color: '#374151' }}>
                La comunidad hispana que está dejando de correr en carreras saturadas...Y empieza a prosperar 
                con habilidades del futuro.
              </Typography>

              <Typography sx={{ color: '#374151' }}>
                Lo que desbloqueas por solo $27/mes (valorado en más de $2,000) 💰
              </Typography>

              {/* Features List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  "Cursos premium de Web3, Blockchain, DAOs, Legal Tech, AI, RWA y más",
                  "Certificación on-chain para validar tus conocimientos en la industria",
                  "Clases en vivo con expertos y moderadores activos en el mundo cripto",
                  "Reporterías semanales: análisis, tendencias y oportunidades Web3 en tiempo real",
                  "Comunidad activa en Skool y Telegram para colaborar, preguntar y crecer",
                  "Acceso inmediato a herramientas, infografías y recursos aplicables desde el día 1",
                  "Roadmap estructurado para que vayas de cero a ofrecer tus servicios en el ecosistema Web3"
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography sx={{ color: '#10b981', mt: 0.5 }}>✅</Typography>
                    <Typography sx={{ color: '#374151', fontSize: '0.875rem' }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ 
                backgroundColor: '#fef2f2',
                borderLeft: '4px solid #f87171',
                p: 2,
                my: 2
              }}>
                <Typography sx={{ color: '#dc2626', fontSize: '0.875rem' }}>
                  ❗ Todos los cursos son flexibles, grabados y sin relleno
                </Typography>
              </Box>

              <Box sx={{ 
                backgroundColor: '#fff7ed',
                borderLeft: '4px solid #fb923c',
                p: 2
              }}>
                <Typography sx={{ color: '#ea580c', fontSize: '0.875rem', fontWeight: '500' }}>
                  🎁 Bonus: Trade Ideas semanales y ejemplos reales
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CommunityAbout;
