module.exports = {
  metadata: {
    title: 'Nouveau Guide',
    subtitle: 'Description de mon guide',
    author: 'Auteur',
    date: new Date().toLocaleDateString('fr-FR'),
    institution: 'Mon Entreprise',
    // coverLogo: { src: 'src/source_content/main_logo.png', alt: 'Main Logo' },
    // logos: [
    //   { src: 'src/source_content/logo1.png', alt: 'Logo 1' }
    // ],
    // institutionLogo: { src: 'src/source_content/institution_logo.png', alt: 'Institution' }
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
