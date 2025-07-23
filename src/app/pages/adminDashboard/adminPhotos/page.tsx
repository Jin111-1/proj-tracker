import React from 'react';
import { useProjectImages } from '../../../hooks/useProjectsPhoto';

const AdminPhotosPage = () => {
  // ตัวอย่าง: กำหนด projectId เป็น '1' (สามารถเปลี่ยนเป็น dynamic ได้ภายหลัง)
  const projectId = '1';
  const { images, loading, error, reload } = useProjectImages(projectId);

  return (
    <div>
      <h1>Admin Photos</h1>
      {loading && <p>กำลังโหลดรูปภาพ...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {images && images.length > 0 ? (
          images.map((img, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: 8 }}>
              <img src={img.url || img.path || ''} alt={`project-img-${idx}`} style={{ maxWidth: 200, maxHeight: 200 }} />
            </div>
          ))
        ) : (
          !loading && <p>ไม่พบรูปภาพ</p>
        )}
      </div>
      <button onClick={reload} style={{ marginTop: 16 }}>รีโหลดรูปภาพ</button>
    </div>
  );
};

export default AdminPhotosPage;
