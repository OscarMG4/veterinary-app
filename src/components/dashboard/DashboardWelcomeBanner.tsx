import { PET_IMAGES } from '../../constants/images'

export function DashboardWelcomeBanner() {
  return (
    <div className="dashboard-welcome">
      <div className="dashboard-welcome-text">
        <span className="dashboard-welcome-label">Tu clínica veterinaria</span>
        <h2 className="dashboard-welcome-title">
          Cuidamos a quienes cuidan a sus mascotas
        </h2>
        <p className="dashboard-welcome-desc">
          Gestiona ventas, inventario de medicamentos e insumos desde un solo
          lugar.
        </p>
      </div>
      <div className="dashboard-welcome-gallery">
        <img src={PET_IMAGES.dog} alt="Perro en consulta veterinaria" />
        <img src={PET_IMAGES.cat} alt="Gato" className="gallery-offset" />
        <img src={PET_IMAGES.puppy} alt="Cachorro" />
      </div>
    </div>
  )
}
