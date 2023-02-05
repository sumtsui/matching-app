import React from "react";
import { useFormik } from "formik";
import { Button, Input, Radio, Space } from "antd";
import Layout from "../layout";
import { addUser } from "../api/user";

// type FormValues = {
//   email: string;
//   password: string;
// };

// type FormErrors = Partial<Record<keyof FormValues, string>>;

const RegistrationForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "male",
      phoneNumber: "",
      jobTitle: "",
      age: 26,
    },
    onSubmit: async (values) => {
      const result = await addUser(values);
      console.log(result);
    },
  });
  return (
    <Layout>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Input
          addonBefore="昵称"
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <Space.Compact block>
          <Radio.Group
            name="gender"
            onChange={formik.handleChange}
            style={{ margin: 8, marginBottom: 16 }}
          >
            <Radio value="male" name="gender">
              男生
            </Radio>
            <Radio value="female" name="gender">
              女生
            </Radio>
          </Radio.Group>
        </Space.Compact>

        <Input
          addonBefore="职业"
          id="jobTitle"
          name="jobTitle"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.jobTitle}
        />

        <Input
          addonBefore="年龄"
          id="age"
          name="age"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.age}
        />

        <Input
          addonBefore="电话"
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.phoneNumber}
        />

        <Button type="primary" onClick={formik.handleSubmit}>
          保存
        </Button>
      </Space>
    </Layout>
  );
};

export default RegistrationForm;