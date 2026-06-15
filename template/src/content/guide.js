module.exports = {
  metadata: {
    title: 'Nouveau Guide',
    subtitle: 'Description de mon guide',
    author: 'Auteur',
    date: new Date().toLocaleDateString('fr-FR'),
    institution: 'Mon Entreprise',
    logos: [
      { src: 'src/source_content/logo1.png', alt: 'Logo 1' }
    ],
    institutionLogo: { src: 'src/source_content/main_logo.png', alt: 'Main Logo' }
  },
  sections: [
    {
      id: 'intro',
      title: 'Introduction',
      blocks: [
        {
          type: 'text',
          content: 'Bienvenue dans ce nouveau guide généré automatiquement.'
        }
      ]
    }
  ]
};
