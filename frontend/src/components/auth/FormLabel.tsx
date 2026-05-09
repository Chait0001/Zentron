import { ChangeEvent, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import styles from "./FormLabel.module.css";

type Props = {
	className?: string;
	htmlFor: string;
	label: string;
	type: string;
	id: string;
	required: boolean;
	maxLength: number;
	minLength: number;
	value?: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	inputPH?: string;
	labelPH?: string;
    name:string
};

const FormLabel = (props: Props) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordType = props.type === "password";
	const currentType = isPasswordType && showPassword ? "text" : props.type;

	return (
		<div className={`${styles.label} ${props.className}`}>
			<label htmlFor={props.htmlFor} placeholder={props.labelPH}>
				{props.label}
			</label>
			<div className={styles.inputContainer}>
				<input
					type={currentType}
					id={props.id}
					name={props.name}
					required={props.required}
					maxLength={props.maxLength}
					minLength={props.minLength}
					value={props.value}
					onChange={props.onChange}
					placeholder={props.inputPH}
				/>
				{isPasswordType && (
					<button
						type="button"
						className={styles.eyeButton}
						onClick={() => setShowPassword(!showPassword)}
						aria-label="Toggle password visibility"
					>
						{showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
					</button>
				)}
			</div>
		</div>
	);
};

export default FormLabel;
