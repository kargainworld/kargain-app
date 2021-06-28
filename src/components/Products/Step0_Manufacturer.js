import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { Col, Row } from 'reactstrap'
import useTranslation from 'next-translate/useTranslation'
import FieldWrapper from '../Form/FieldWrapper'
import TextInput from '../Form/Inputs/TextInput'
import StepNavigation from '../Form/StepNavigation'
import SelectInput from '../Form/Inputs/SelectInput'
import { FormContext } from '../../context/FormContext'
import { MessageContext } from '../../context/MessageContext'
import VehiclesService from '../../services/VehiclesService'
import { vehicleTypes, vehicleTypeRefModels } from '../../business/vehicleTypes'

const Step0_Manufacturer = ({ vehicleType, triggerSkipStep, onSubmitStep, prevStep }) => {
	const { t, lang } = useTranslation()
	const cache = useRef({})
	const formRef = useRef(null)
	const isCar = vehicleType === vehicleTypes.car
	const vehicleTypeModel = vehicleTypeRefModels[vehicleType]
	const { dispatchModalError } = useContext(MessageContext)
	const { formDataContext, dispatchFormUpdate } = useContext(FormContext)

	const { watch, control, errors, handleSubmit, setValue } = useForm({
		mode: 'onChange',
		validateCriteriaMode: 'all',
		defaultValues: formDataContext,

	})

	const [manufacturersData, setManufacturersData] = useState({
		makes: [],
		models: [],
		generations: [],
		years: [],
		version: ''
	})

	const selectedMake = watch('manufacturer.make')
	const selectedModel = watch('manufacturer.model')
	const selectedVersion = watch('manufacturer.version');
	const selectedYear = watch('manufacturer.year')

	dispatchFormUpdate(watch(), { compare: true })

	const getMonths = () => moment.localeData(lang)
		.months()
		.map(month => ({ value: month, label: month }))


	useEffect(() => {
		// setValue('manufacturer.model', null)
		// setValue('manufacturer.year', null)
	}, [selectedMake, setValue])

	useEffect(() => {
		// setValue('manufacturer.version', null)
		// setValue('manufacturer.year', null)
	}, [selectedModel, setValue])

	const triggerSubmit = () => {
		formRef.current.dispatchEvent(new Event('submit'))
	}

	const fetchMakes = useCallback(async () => {
		const cacheKey = `${vehicleType}_makes`

		if (!cache.current[cacheKey]) {
			await VehiclesService.getMakes(vehicleTypeModel)
				.then(makes => {
					if (!Array.isArray(makes)) makes = [makes]
					const makesOptions = makes.map(make => ({
						value: make._id,
						label: make.make
					}))

					const defaultOption = {
						value: 'other',
						label: t(`vehicles:i_dont_know_other`)
					}

					const data = [...makesOptions, defaultOption]
					cache.current[cacheKey] = data

					setManufacturersData(manufacturersData => (
						{
							...manufacturersData,
							makes: data
						})
					)
				})
				.catch(err => {
					dispatchModalError({ err })
				})
		} else {
			setManufacturersData(manufacturersData => (
				{
					...manufacturersData,
					makes: cache.current[cacheKey]
				})
			)
		}

	}, [vehicleType])

	const fetchModels = useCallback(async () => {
		const make = selectedMake?.label
		const cacheKey = `${vehicleType}_makes_${make}_models`
		console.log(cache.current[cacheKey], '>>>>>>>>>>>>')
		if (!make) return
		if (!cache.current[cacheKey]) {
			console.log('fetch models')
			const modelsService = isCar ? VehiclesService.getCarsDistinctModels
				: VehiclesService.getMakeModels

			await modelsService(vehicleTypeModel, make)
				.then(models => {
					if (!Array.isArray(models)) models = [models]
					let modelsOptions = []

					if (isCar) {
						modelsOptions = models.map(model => ({
							value: model,
							label: model
						}))
					}
					else {
						modelsOptions = models.map(model => ({
							value: model._id,
							label: model.model
						}))
					}

					const defaultOption = {
						value: 'other',
						label: t(`vehicles:i_dont_know_other`)
					}

					const data = [...modelsOptions, defaultOption]
					cache.current[cacheKey] = data

					setManufacturersData(manufacturersData => (
						{
							...manufacturersData,
							models: data
						})
					)
				})
				.catch(err => {
					dispatchModalError({
						err,
						persist: true
					})
				})
		} else {
			setManufacturersData(manufacturersData => (
				{
					...manufacturersData,
					models: cache.current[cacheKey]
				})
			)
		}
	}, [vehicleType, isCar, selectedMake])

	const fetchModelsYears = useCallback(async () => {
		const make = selectedMake?.label
		const model = selectedModel?.label
		const cacheKey = `${vehicleType}_makes_${make}_models_${model}`

		if (!isCar || !make || !model) return
		if (!cache.current[cacheKey]) {
			console.log('fetch cars models years')
			await VehiclesService.getCarsMakeModelTrimYears(make, model)
				.then(years => {
					if (!Array.isArray(years)) years = [years]

					const yearsOptions = years.map(year => ({
						value: year._id,
						label: year.year
					}))

					const defaultOption = {
						value: 'other',
						label: t(`vehicles:i_dont_know_other`)
					}

					const data = [...yearsOptions, defaultOption]
					cache.current[cacheKey] = data

					setManufacturersData(manufacturersData => (
						{
							...manufacturersData,
							years: data
						})
					)
				})
				.catch(err => {
					dispatchModalError({ err })
				})
		} else {
			setManufacturersData(manufacturersData => (
				{
					...manufacturersData,
					years: cache.current[cacheKey]
				})
			)
		}
	}, [vehicleType, isCar, selectedMake, selectedModel])

	useEffect(() => {
		fetchMakes()
	}, [fetchMakes])

	useEffect(() => {
		const make = selectedMake?.label
		if (!make) return
		fetchModels()
	}, [selectedMake, fetchModels])

	useEffect(() => {
		const model = selectedModel?.label
		if (!model) return
		if (!isCar) return
		fetchModelsYears()
	}, [selectedModel, fetchModelsYears])

	useEffect(() => {
		const make = selectedMake?.label
		const model = selectedModel?.label
		const year = selectedYear?.label

		if (!make) return
		if (!model) return

		if (!isCar) {
			triggerSubmit()
			return
		}

		// if (year) triggerSubmit()
	}, [selectedMake, selectedModel, selectedYear])

	const onMakeChange = value => {
		setValue('manufacturer.model', null)
		setValue('manufacturer.year', null)
		console.log('Make Changed!!!');
		return value
	}

	const onModelChange = value => {
		setValue('manufacturer.year', null)

		return value
	}
	return (
		<form className="form_wizard" ref={formRef} onSubmit={handleSubmit(onSubmitStep)}>
			<Row>
				<Col md={4}>
					<FieldWrapper label={t(`vehicles:make`)} labelTop>
						<SelectInput
							name="manufacturer.make"
							placeholder={t('vehicles:select')}
							control={control}
							errors={errors}
							options={manufacturersData.makes}
							onChange={onMakeChange}
							rules={{ required: t('form_validations:required') }}
						/>
					</FieldWrapper>
				</Col>

				<Col md={4}>
					<FieldWrapper label={t(`vehicles:model`)} labelTop>
						<SelectInput
							name="manufacturer.model"
							placeholder={t('vehicles:select')}
							options={manufacturersData.models}
							disabled={!watch('manufacturer.make')}
							control={control}
							errors={errors}
							onChange={onModelChange}
							rules={{ required: t('form_validations:required') }}
						/>
					</FieldWrapper>
				</Col>

				<Col md={4}>
					<FieldWrapper label={t('vehicles:version')} labelTop>
						<TextInput
							disabled={!watch('manufacturer.model')}
							name="manufacturer.version"
							control={control}
							errors={errors}
						/>
					</FieldWrapper>
				</Col>

				<Col md={4}>
					<FieldWrapper label={t('vehicles:month')} labelTop>
						<SelectInput
							name="manufacturer.month"
							placeholder={t('vehicles:select')}
							options={getMonths()}
							control={control}
							errors={errors}
							disabled={!watch('manufacturer.model') || !isCar}
						/>
					</FieldWrapper>
				</Col>

				<Col md={4}>
					<FieldWrapper label={t('vehicles:year')}>
						<SelectInput
							name="manufacturer.year"
							placeholder={t('vehicles:select')}
							options={manufacturersData.years}
							control={control}
							errors={errors}
							disabled={!watch('manufacturer.model') || !isCar}
							rules={{ required: t('form_validations:required') }}
						/>
					</FieldWrapper>
				</Col>
			</Row>
			<button className="btn" onClick={triggerSkipStep}>{t(`vehicles:skip-step`)}</button>
			<StepNavigation prev={prevStep} submit />
		</form>
	)
}

Step0_Manufacturer.propTypes = {
	vehicleType: PropTypes.string.isRequired
}

export default Step0_Manufacturer
