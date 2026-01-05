import { useEffect, useState } from 'react';
import { Form, Select, Input } from 'antd';
import addressData from './address.json';

const AddressSelector = ({ form, defaultAddress = {} }) => {
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [fullAddress, setFullAddress] = useState('');

  // Lấy danh sách tỉnh/thành phố
  const provinces = Object.values(addressData).map((data) => ({
    value: data.name_with_type, // Sử dụng name_with_type thay vì name
    label: data.name_with_type,
  }));

  // Khởi tạo giá trị mặc định
  useEffect(() => {
    if (defaultAddress && Object.keys(defaultAddress).length > 0) {
      const provinceEntry = Object.values(addressData).find(
        (val) => val.name_with_type === defaultAddress.province
      );

      if (provinceEntry) {
        const districtList = Object.values(provinceEntry['quan-huyen']).map((data) => ({
          value: data.name_with_type,
          label: data.name_with_type,
        }));
        setDistricts(districtList);

        const districtEntry = Object.values(provinceEntry['quan-huyen']).find(
          (d) => d.name_with_type === defaultAddress.district
        );

        if (districtEntry) {
          const wardList = Object.values(districtEntry['xa-phuong']).map((data) => ({
            value: data.name_with_type,
            label: data.name_with_type,
          }));
          setWards(wardList);

          // Set giá trị cho form
          form.setFieldsValue({
            province: defaultAddress.province,
            district: defaultAddress.district,
            ward: defaultAddress.ward,
            detail: defaultAddress.detail || '',
          });
          updateFullAddress(defaultAddress);
        }
      }
    }
  }, [defaultAddress, form]);

  // Cập nhật địa chỉ đầy đủ
  const updateFullAddress = (address) => {
    const addressParts = [
      address.detail,
      address.ward,
      address.district,
      address.province
    ].filter(Boolean);

    const newFullAddress = addressParts.join(', ');
    setFullAddress(newFullAddress);
    form.setFieldsValue({ full_address: newFullAddress });
  };

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (value) => {
    const province = Object.values(addressData).find(p => p.name_with_type === value);

    form.setFieldsValue({
      province: value,
      district: undefined,
      ward: undefined,
      detail: ''
    });

    const districtList = Object.values(province['quan-huyen']).map((data) => ({
      value: data.name_with_type,
      label: data.name_with_type,
    }));
    setDistricts(districtList);
    setWards([]);
    updateFullAddress({
      province: value
    });
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (value) => {
    const provinceName = form.getFieldValue('province');
    const province = Object.values(addressData).find(p => p.name_with_type === provinceName);
    const district = Object.values(province['quan-huyen']).find(d => d.name_with_type === value);

    form.setFieldsValue({
      district: value,
      ward: undefined,
      detail: ''
    });

    const wardList = Object.values(district['xa-phuong']).map((data) => ({
      value: data.name_with_type,
      label: data.name_with_type,
    }));
    setWards(wardList);
    updateFullAddress({
      province: provinceName,
      district: value
    });
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (value) => {
    form.setFieldsValue({ ward: value });
    updateFullAddress({
      province: form.getFieldValue('province'),
      district: form.getFieldValue('district'),
      ward: value
    });
  };

  // Xử lý khi thay đổi số nhà/đường
  const handleDetailChange = (e) => {
    const detail = e.target.value;
    form.setFieldsValue({ detail });
    updateFullAddress({
      ...form.getFieldsValue(['province', 'district', 'ward']),
      detail
    });
  };

  return (
    <>
      <Form.Item
        name="province"
        label="Tỉnh/Thành phố"
        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
      >
        <Select
          placeholder="Chọn Tỉnh/Thành phố"
          onChange={handleProvinceChange}
          options={provinces}
          // showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="district"
        label="Quận/Huyện"
        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
      >
        <Select
          placeholder="Chọn Quận/Huyện"
          onChange={handleDistrictChange}
          options={districts}
          disabled={!form.getFieldValue('province')}
          // showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="ward"
        label="Phường/Xã"
        rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
      >
        <Select
          placeholder="Chọn Phường/Xã"
          onChange={handleWardChange}
          options={wards}
          disabled={!form.getFieldValue('district')}
          // showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>

      <Form.Item
        name="detail"
        label="Số nhà, tên đường"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
      >
        <Input.TextArea
          placeholder="Ví dụ: Số 1, đường ABC, tòa nhà XYZ"
          rows={2}
          allowClear
          onChange={handleDetailChange}
        />
      </Form.Item>

      {/* Trường ẩn lưu địa chỉ đầy đủ */}
      <Form.Item name="full_address" hidden>
        <Input />
      </Form.Item>

      {/* Hiển thị địa chỉ đầy đủ */}
      {fullAddress && (
        <div className="ant-form-item">
          <div className="ant-form-item-label">
            <label>Địa chỉ đầy đủ:</label>
          </div>
          <div className="ant-form-item-control">
            <div className="ant-form-item-control-input">
              <div className="ant-form-item-control-input-content">
                <p className="text-gray-600">{fullAddress}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSelector;