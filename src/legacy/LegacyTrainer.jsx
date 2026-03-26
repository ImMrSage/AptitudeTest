import { useMemo } from 'react'
import legacyBody from './legacyBody.html?raw'
import legacyStyles from './legacyStyles.css?raw'
import legacyScript from './legacyScript.js?raw'

function LegacyTrainer() {
  const srcDoc = useMemo(() => {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aptitude Trainer Legacy</title>
  <style>${legacyStyles}</style>
</head>
<body>
  ${legacyBody}
  <script>${legacyScript}<\/script>
</body>
</html>`
  }, [])

  return (
    <iframe
      className="trainer-frame"
      srcDoc={srcDoc}
      title="Aptitude Trainer Legacy Module"
    />
  )
}

export default LegacyTrainer
